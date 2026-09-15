# Make login and signup work end to end

Decision: keep the current backend (Lovable Cloud, which is managed Supabase — same database and auth technology). Switching to a separate self-managed Supabase project would require recreating tables, security rules, and triggers, and existing accounts would not carry over. This can be revisited later if direct database dashboard access is needed.

## Current state (verified)

- Backend is connected and healthy; `profiles` and `interview_sessions` tables exist with row-level security.
- The `handle_new_user` trigger auto-creates a profile on signup — already in place.
- 3 accounts already exist, so sign-up has worked before.
- Sign-in page (`/auth`) with email/password and Google button is already built.

## Steps

1. **Turn on email/password sign-in** — call `enable_email_auth` (off by default on new projects; without it every sign-up/sign-in fails).
2. **Confirm Google sign-in is enabled** — verify the Google provider; enable it if missing so "Continue with Google" works.
3. **Test the full flow in the preview** — create a new account with email/password, confirm the email-confirmation message, sign in, verify the Practice page loads and a saved session appears in History.
4. **Fix anything the tests reveal** — error messages, redirects, or profile creation issues.

## Technical details

- No new tables or schema changes needed.
- Email confirmation stays on (default): new users confirm via email before first sign-in.
- Files involved: `src/routes/auth.tsx`, `src/hooks/useAuth.ts`, `src/routes/_authenticated/route.tsx`.
