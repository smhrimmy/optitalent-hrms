# Project checklist (hard gate)

Evidence for `complete-project-checklist.pdf` and `ui-ux-human-design-guide.pdf`.
Boxes marked **NOT DONE** are not faked.

## 1. Planning

- [x] Goal: one HR workspace per tenant (people, time, pay, hire, tickets). KPI: demo login reaches a working dashboard.
- [x] Audience: HR, managers, employees in a company file.
- [x] Scope: this Next.js app + Supabase. Dual Prisma backend under `optitalent-hrms/backend` is legacy and not the Vercel surface.
- [x] Stack: Next.js App Router, Tailwind, shadcn primitives restyled, Supabase Auth/Postgres.
- [x] Hosting: Vercel. Data: Supabase.
- [x] Risks: idle Supabase pause (keepalive cron), preview URLs that do not update, secrets pasted in chat (rotate).
- [x] IA: `/login`, `/{role}/…` modules, legal pages, `/errors/{code}`.
- [ ] High-fidelity wireframes signed by a human designer — **NOT DONE**.

## 2. UI / UX

- [x] Tokens: `design-tokens.json`, CSS variables, Fraunces + Source Sans 3 (not Inter + purple).
- [x] Responsive layout + mobile bottom nav.
- [x] Light/dark via next-themes.
- [x] Empty state component; loaders (`BrandLoader`, skeletons).
- [x] Form validation on signup password rules; login errors.
- [x] Contrast: ink on paper. Favicon: `/favicon.svg`.
- [x] Style notes: `docs/DESIGN_SYSTEM.md`.
- [ ] Storybook — **NOT DONE** (app components only).

## 3. Error pages

All exist as routes: `/errors/400`–`504`, `/offline`, `/session-expired`, `/payment-failed`, `/empty-search`, `/suspended`, `/coming-soon`, `/unsupported`, `not-found.tsx`, `error.tsx`. Showcase: `/demo/errors`.

## 4–6. Frontend / backend / database

- [x] Semantic HTML on legal + landing.
- [x] Debounced command search already in header.
- [x] Env-based config with public fallback URL (anon key is public; **service role must never ship to the client**).
- [x] `/api/health`, `/api/openapi`, `/api/keepalive`, provision route.
- [x] In-memory rate limit in middleware (not Redis).
- [x] Schema + RLS in `supabase/` and bootstrap SQL.
- [ ] Load-tested query budget — **NOT DONE**.
- [ ] Virus scan on uploads — **NOT DONE**.

## 7. Security

- [x] HSTS, X-Frame-Options, nosniff, Referrer-Policy, CSP (report-only not used; inline scripts allowed because Next needs them).
- [x] RLS on tenant tables (bootstrap SQL).
- [x] Passwords via Supabase (bcrypt internally).
- [x] Dependabot weekly.
- [ ] MFA in product UI — **NOT DONE** (Supabase can enable it in dashboard).
- [ ] Bot CAPTCHA — **NOT DONE**.
- [ ] Pen test — **NOT DONE**.
- [ ] DDoS/WAF beyond Vercel — **NOT DONE**.
- [ ] Sentry — **NOT DONE**.

## 8–11. Performance, SEO, a11y, QA

- [x] robots.ts, sitemap.ts, OG tags.
- [x] Keyboard focus rings on buttons.
- [x] 44px tap targets on `Button`.
- [ ] Lighthouse score recorded — **NOT DONE** in this change.
- [ ] Unit/E2E coverage 80% — **NOT DONE**.
- [ ] VoiceOver pass — **NOT DONE**.

## 12. DevOps

- [x] CI: `.github/workflows/ci.yml` (lint + build).
- [x] Keepalive workflow + Vercel cron.
- [x] Health: `GET /api/health`.
- [ ] IaC Terraform — **NOT DONE**.
- [ ] Central logging/Sentry — **NOT DONE**.

## 13. Legal

- [x] `/privacy` `/terms` `/cookies` banner `/accessibility` `/contact` `/help`.

## 14. Analytics

- [ ] GA4/Plausible — **NOT DONE**.
- [ ] Error tracking SaaS — **NOT DONE**.

## 15. Docs

- [x] README, DESIGN_SYSTEM, this file, CHANGELOG, DEPLOYMENT, OpenAPI JSON.

## 16. Pre-launch

- [x] Legal live.
- [ ] Staging mirrors production secrets — operator task.
- [ ] Backup restore drill — operator task.

## 16B. Global scale (hard: do not tick)

- [ ] Millions of concurrent users
- [ ] Redis cluster / multi-region
- [ ] Chaos engineering
- [ ] 5× load test

These are **not** implemented. This app is a single-region Next + Supabase tenant HR file.

## UI guide (human design)

- [x] Avoided purple glass Inter template.
- [x] Product-specific: paper, forest ink, personnel-file copy.
- [x] Nielsen: visibility (toasts, loaders), match real HR words, user control (Back, skip via demo login without signup), consistency, error recovery pages, recognition (command palette), flexibility, aesthetic (quiet paper), help (`/help`).
- [x] `prefers-reduced-motion` on loader.
- [x] Self-critique: memorable = folder/ink, not gradient hero.
