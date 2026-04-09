-- Seed core sessions
insert into public.sessions (id, title, description, total_duration)
values 
('11111111-1111-1111-1111-111111111111', 'Daily Resilience', 'A structured multi-step session for mental clarity', 1800);

-- Seed session steps
insert into public.session_steps (session_id, title, audio_url, duration, order_index)
values 
('11111111-1111-1111-1111-111111111111', 'Brain-Heart Coherence', 'session-audio/coherence.mp3', 120, 0),
('11111111-1111-1111-1111-111111111111', 'Wim Hof Breathing', 'session-audio/wimhof.mp3', 600, 1),
('11111111-1111-1111-1111-111111111111', 'Bhramari Pranayama', 'session-audio/bhramari.mp3', 180, 2),
('11111111-1111-1111-1111-111111111111', 'Meditation', 'session-audio/meditation.mp3', 900, 3);
