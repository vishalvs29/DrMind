-- 1. Create sessions table
create table public.sessions (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    total_duration int not null default 0,
    created_at timestamptz default now()
);

-- 2. Create session_steps table
create table public.session_steps (
    id uuid default gen_random_uuid() primary key,
    session_id uuid references public.sessions(id) on delete cascade not null,
    title text not null,
    audio_url text not null,
    duration int not null, -- in seconds
    order_index int not null,
    created_at timestamptz default now()
);

-- 3. Create user_session_progress table
create table public.user_session_progress (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    session_id uuid references public.sessions(id) on delete cascade not null,
    current_step_index int default 0,
    progress_seconds int default 0,
    completed_steps jsonb default '[]'::jsonb,
    is_completed boolean default false,
    updated_at timestamptz default now(),
    unique(user_id, session_id)
);

-- 4. Create session_events table (Analytics)
create table public.session_events (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    session_id uuid references public.sessions(id) on delete cascade not null,
    event_type text not null, -- SESSION_STARTED, STEP_COMPLETED, SESSION_COMPLETED, SESSION_DROPPED
    timestamp timestamptz default now()
);

-- 5. Enable Row Level Security (RLS)
alter table public.sessions enable row level security;
alter table public.session_steps enable row level security;
alter table public.user_session_progress enable row level security;
alter table public.session_events enable row level security;

-- 6. RLS Policies

-- Sessions and steps are publicly readable
create policy "Sessions are publicly readable" on public.sessions for select using (true);
create policy "Session steps are publicly readable" on public.session_steps for select using (true);

-- Users can only access their own progress
create policy "Users can view own progress" on public.user_session_progress 
    for select using (auth.uid() = user_id);

create policy "Users can insert own progress" on public.user_session_progress 
    for insert with check (auth.uid() = user_id);

create policy "Users can update own progress" on public.user_session_progress 
    for update using (auth.uid() = user_id);

-- Analytics policies
create policy "Users can insert own events" on public.session_events 
    for insert with check (auth.uid() = user_id);

create policy "Users can view own events" on public.session_events 
    for select using (auth.uid() = user_id);

-- 7. Indexes for performance
create index idx_progress_user_id on public.user_session_progress(user_id);
create index idx_progress_session_id on public.user_session_progress(session_id);
create index idx_progress_user_session on public.user_session_progress(user_id, session_id);
create index idx_steps_session_id on public.session_steps(session_id);
create index idx_events_user_id on public.session_events(user_id);
create index idx_events_timestamp on public.session_events(timestamp);

-- 8. Functions & Triggers
-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger tr_user_session_progress_updated_at
    before update on public.user_session_progress
    for each row
    execute function public.handle_updated_at();
