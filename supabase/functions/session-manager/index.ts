import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
        if (userError || !user) throw new Error('Unauthorized')

        const url = new URL(req.url)
        const path = url.pathname.replace('/session-manager', '')
        const body = req.method !== 'GET' ? await req.json() : {}

        let result;

        switch (path) {
            case '/start-session':
                result = await handleStartSession(supabaseClient, user.id, body.session_id)
                break;
            case '/update-progress':
                result = await handleUpdateProgress(supabaseClient, user.id, body)
                break;
            case '/complete-step':
                result = await handleCompleteStep(supabaseClient, user.id, body)
                break;
            case '/complete-session':
                result = await handleCompleteSession(supabaseClient, user.id, body.session_id)
                break;
            case '/get-progress':
                result = await handleGetProgress(supabaseClient, user.id, url.searchParams.get('session_id'))
                break;
            default:
                return new Response(JSON.stringify({ error: 'Not Found' }), {
                    status: 404,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
        }

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

async function handleStartSession(supabase: any, user_id: string, session_id: string) {
    const { data, error } = await supabase
        .from('user_session_progress')
        .upsert({
            user_id,
            session_id,
            current_step_index: 0,
            progress_seconds: 0,
            completed_steps: [],
            is_completed: false,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,session_id' })
        .select()
        .single()

    if (error) throw error

    await logEvent(supabase, user_id, session_id, 'SESSION_STARTED')
    return data
}

async function handleUpdateProgress(supabase: any, user_id: string, body: any) {
    const { session_id, step_index, progress_seconds } = body
    const { data, error } = await supabase
        .from('user_session_progress')
        .update({
            current_step_index: step_index,
            progress_seconds,
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', user_id)
        .eq('session_id', session_id)
        .select()
        .single()

    if (error) throw error
    return data
}

async function handleCompleteStep(supabase: any, user_id: string, body: any) {
    const { session_id, step_id, next_step_index } = body

    // Get current progress
    const { data: progress } = await supabase
        .from('user_session_progress')
        .select('completed_steps')
        .eq('user_id', user_id)
        .eq('session_id', session_id)
        .single()

    const completed = progress?.completed_steps || []
    if (!completed.includes(step_id)) {
        completed.push(step_id)
    }

    const { data, error } = await supabase
        .from('user_session_progress')
        .update({
            completed_steps: completed,
            current_step_index: next_step_index,
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', user_id)
        .eq('session_id', session_id)
        .select()
        .single()

    if (error) throw error
    await logEvent(supabase, user_id, session_id, 'STEP_COMPLETED')
    return data
}

async function handleCompleteSession(supabase: any, user_id: string, session_id: string) {
    const { data, error } = await supabase
        .from('user_session_progress')
        .update({
            is_completed: true,
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', user_id)
        .eq('session_id', session_id)
        .select()
        .single()

    if (error) throw error
    await logEvent(supabase, user_id, session_id, 'SESSION_COMPLETED')
    return data
}

async function handleGetProgress(supabase: any, user_id: string, session_id: string | null) {
    let query = supabase
        .from('user_session_progress')
        .select('*, session:sessions(*, steps:session_steps(*))')
        .eq('user_id', user_id)

    if (session_id) {
        query = query.eq('session_id', session_id).single()
    }

    const { data, error } = await query
    if (error) throw error
    return data
}

async function logEvent(supabase: any, user_id: string, session_id: string, event_type: string) {
    await supabase.from('session_events').insert({
        user_id,
        session_id,
        event_type,
    })
}
