# New Supabase project bootstrap

## 1. Create the schema

In the Supabase dashboard open **SQL Editor**, paste `supabase/bootstrap_new_project.sql`, and run it.

That script creates:

- Multi-tenant core: `tenants`, `users` (FK to `auth.users`), `departments`, `employees`
- ATS: `job_openings`, `job_listings`, `applicants`, `interview_notes`, `assessments`, `assessment_attempts`, `walkin_events`
- Leave / attendance: `leave_balances`, `leave_requests`, `holidays`, `attendance`
- Helpdesk: `helpdesk_tickets`, `helpdesk_messages` (+ storage bucket `helpdesk-attachments`)
- Payroll: `payroll_history`, `payroll_runs`
- Learning / performance / feed: `courses`, `course_enrollments`, `performance_reviews`, `company_feed_posts`, `bonus_points_history`
- Profile: `work_experience`, `education`
- Notifications (realtime enabled)
- Keep-alive: `app_heartbeat` + RPC `touch_heartbeat(p_source text)`
- Trigger `on_auth_user_created` → `public.handle_new_user()`
- Tenant-scoped RLS on operational tables

It also seeds tenant **OptiTalent HQ** (`slug = optitalent`).

## 2. Create the first login (Auth)

SQL cannot insert into `auth.users` from the dashboard as a restricted role in some projects. Use **Authentication → Users → Add user**, then set `public.users.role` / `tenant_id`:

```sql
UPDATE public.users
SET role = 'super-admin',
    tenant_id = (SELECT id FROM public.tenants WHERE slug = 'optitalent')
WHERE email = 'you@example.com';
```

## 3. Vercel / app env

Set at least:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET` or `KEEPALIVE_API_KEY` (same long random string is fine)

See `.env.example`. Do not commit real keys.

## 4. Keep the project from pausing

Supabase **free** projects pause after a week with no database activity. The schema exposes an RPC any keep-alive can hit:

```bash
curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/touch_heartbeat" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"p_source":"manual"}'
```

The app also has `GET|POST /api/keepalive` (Bearer / `x-api-key` / `?key=`). Vercel Cron hits it every 6 hours (`vercel.json`). GitHub Actions `.github/workflows/supabase-keepalive.yml` does the same if you add repo secrets:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- optional `KEEPALIVE_URL` + `KEEPALIVE_API_KEY` (production `/api/keepalive`)

Hobby Vercel only runs crons **once per day**; the GitHub Action every 6 hours is the reliable idle ping.

Pausing is a platform policy. Pinging keeps compute warm; it does not replace backups or a paid plan if you need a contractual uptime guarantee.
