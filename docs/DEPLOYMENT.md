# Deployment

1. Vercel project on GitHub `smhrimmy/optitalent-hrms`. Production follows `main`.
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `KEEPALIVE_API_KEY`.
3. Apply `supabase/bootstrap_new_project.sql` on a new project.
4. Cron: `vercel.json` hits `/api/keepalive`. GitHub Actions pings every 6h.
5. Rollback: redeploy the previous Vercel deployment.
6. Health: `GET /api/health`.
7. Preview URLs are per-commit. Old `*-dxlni8zl7-*` links do not receive new commits.

Do not put the service role key in `NEXT_PUBLIC_*`.
