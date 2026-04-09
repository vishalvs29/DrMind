# API Usage: Supabase Edge Functions (session-manager)

Ensure you have a valid `JWT` from `auth.signIn()`.

## 1. Start Session
```bash
curl -X POST https://dioebzxhwkihxqcqzexu.functions.supabase.co/session-manager/start-session \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "11111111-1111-1111-1111-111111111111"}'
```

## 2. Update Progress
```bash
curl -X POST https://dioebzxhwkihxqcqzexu.functions.supabase.co/session-manager/update-progress \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "11111111-1111-1111-1111-111111111111",
    "step_index": 1,
    "progress_seconds": 45
  }'
```

## 3. Complete Step
```bash
curl -X POST https://dioebzxhwkihxqcqzexu.functions.supabase.co/session-manager/complete-step \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "11111111-1111-1111-1111-111111111111",
    "step_id": "STEP_UUID",
    "next_step_index": 2
  }'
```

## 4. Complete Session
```bash
curl -X POST https://dioebzxhwkihxqcqzexu.functions.supabase.co/session-manager/complete-session \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "11111111-1111-1111-1111-111111111111"}'
```

## 5. Get Progress
```bash
curl -X GET "https://dioebzxhwkihxqcqzexu.functions.supabase.co/session-manager/get-progress?session_id=11111111-1111-1111-1111-111111111111" \
  -H "Authorization: Bearer YOUR_JWT"
```
