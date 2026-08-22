# Master project checklist — evidence

Source: complete-project-checklist PDF. Evidence in this repo (not a claim of production-scale load tests).

## 1. Planning
- KPIs: dashboard headcount, pending leave, open jobs, tickets, expenses, approvals (`dataQuery.dashboardStats`)
- Personas: admin, HR, manager, employee (`use-nav`)
- Competitors: BambooHR ESS, Rippling inbox/IT-HR, Workday comp/OKRs (`docs/DESIGN_SYSTEM.md`)
- Stack: Next.js App Router, TypeScript, Supabase optional, local dataquery (`README`)

## 2. UI/UX
- Tokens + dark mode: `globals.css`
- Empty states: `EmptyState`
- Loading/splash/skeletons: `SplashScreen`, `LoadingLogo`, `PageSkeleton`, `app/loading.tsx`
- Motion + reduced-motion: splash + CSS media query
- Icons: lucide-react
- Favicon/manifest: `public/`

## 3. Error pages
Implemented: 404, 401, 403, 400, 500, 502, 503, 504, 429, offline, session, payment, suspended, coming-soon, unsupported, error boundary (`src/app/error.tsx`, `src/app/*` routes, `error-variants.tsx`)

## 4–8. Frontend / security / perf (in-app)
- Env config: `src/lib/supabase.ts` placeholders
- Rate limit middleware: `src/middleware.ts`
- Security headers: X-Frame-Options, HSTS, nosniff, Referrer-Policy
- RBAC via roles + RLS docs
- Health: `GET /api/health`

## 9. SEO
- Metadata, OG, Twitter: `layout.tsx`
- robots.ts, sitemap.ts

## 13. Legal
- `/privacy` `/terms` `/cookies` + cookie banner

## 12. CI
- `.github/workflows/ci.yml`

## 15. Docs
- README, CHANGELOG, ARCHITECTURE_SPEC, DESIGN_SYSTEM, this file

## Not fully evidenced here (needs live ops)
Load/chaos tests, Sentry/GA4 live keys, pentest, multi-region, Redis cluster — documented as ops work, not fake-checked.
