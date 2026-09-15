# Make login and signup work end to end

The backend (Lovable Cloud) is already connected: the database has the `profiles` and `interview_sessions` tables, and 3 accounts already exist. The sign-in page code is written. This plan switches on and verifies the remaining pieces so email/password and Google sign-in reliably work.

## Steps

1. **Turn on email/password sign-in** — call the `enable_email_auth` tool (it's off by default on new projects; without it every sign-up and sign-in fails).
2. **Confirm Google sign-in is enabled** — verify the Google provider is configured; if not, enable it so the "Continue with Google" button works.
3. **Verify the profile auto-creation trigger** — confirm a profile row is created for each new account (the table exists; check the trigger is in place, recreate if missing).
4. **Test the full flow in the preview** — create a new account with email/password, sign out, sign back in, and confirm the Practice page loads and sessions save to History. Test the Google button path as far as possible.
5. **Fix anything the tests reveal** — e.g. error messages, redirects, or missing profile rows.

## Technical details

- No new database tables needed — `profiles` (linked to auth users) and `interview_sessions` already exist with row-level security.
- Email confirmation stays on (default): new users get a "check your email" confirmation before first sign-in.
- Existing files involved: `src/routes/auth.tsx` (sign-in UI), `src/hooks/useAuth.ts`, `src/routes/_authenticated/route.tsx` (redirects signed-out users to /auth).
