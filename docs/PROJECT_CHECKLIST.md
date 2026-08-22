# Master project checklist — evidence vs the uploaded QA PDF

Hard rule: boxes below point at files. Scale/ops items that cannot be proven in this repo are listed last — they are not marked done.

## 1. Planning & requirements
- KPIs: DNA dashboard widgets (`src/engines/dashboard.ts`) + `dataQuery.dashboardStats`
- Personas: employee / manager / HR generated from DNA (`src/engines/navigation.ts`)
- Competitors: Workday/Keka/Darwinbox as table stakes (`docs/WORKFORCE_OS.md`, `docs/COMPANY_TYPE_ENGINE.md`)
- Scope: adaptive OS, not “more modules” (`docs/ARCHITECTURE_SPEC.md`)
- Stack: Next.js App Router, TS, optional Supabase, local provider (`src/data/repository.ts`)
- IA: sitemap `src/app/sitemap.ts`; setup → DNA → modules
- Risks: demo localStorage vs production RLS documented in architecture spec

## 2. UI / UX (playbook)
- Tokens: `src/app/globals.css` + portable `design-tokens.json` (forest stamp / paper, not purple SaaS)
- Type: Fraunces + Source Sans 3 (`src/lib/fonts.ts`)
- Empty / loading / splash: `EmptyState`, `PageSkeleton`, `SplashScreen`, `app/loading.tsx`
- Motion: `.ot-enter` 180ms + `prefers-reduced-motion` in `globals.css`; splash is the one orchestrated moment
- Focus: `:focus-visible` ring
- Icons: lucide (not emoji)
- Favicon/manifest: `public/`
- Copy: product-specific (hire-to-exit, DNA, Why) on landing

## 3. Error & system pages
400, 401, 403, 404, 429, 500, 502, 503, 504, offline, session, payment, suspended, coming-soon, unsupported, error boundary — `src/app/*` + `error-variants.tsx`

## 4. Frontend
- Semantic layout, env-based Supabase placeholders (`src/lib/supabase.ts`)
- Debounced directory search
- Form validation on login (inline)
- Production build: `npm run build`

## 5. Backend / API
- `GET /api/health` liveness
- `GET /api/openapi` OpenAPI 3 stub
- `POST /api/tenants/provision` auth + 503 if unconfigured
- Rate limit + security headers in `src/middleware.ts` (HSTS, CSP, nosniff, frame, referrer, permissions-policy)
- Idempotency: local demo mutations; production writes documented as needing idempotency keys

## 6. Database
- Schema + RLS notes: `docs/DATABASE_SCHEMA.md`
- Demo store: `src/lib/dataquery.ts` behind `src/data/repository.ts`
- Tenant id: `src/engines/dna.ts` `TENANT_ID`

## 7. Security
- No service-role in client (`supabase-admin` placeholders)
- RBAC/ABAC/field ACL: `src/engines/permission.ts` — AI tools must pass it (`src/ai/tools.ts`)
- Audit: `src/engines/audit.ts` + `/audit`
- Password: demo `password123` documented; production = Supabase Auth hashing
- Dependabot: `.github/dependabot.yml`
- Secrets: env only

## 8. Performance
- Next build code-splitting; images remotePatterns
- Lighthouse/load tests: **not claimed** (ops)

## 9. SEO
- Metadata, OG, Twitter, JSON-LD SoftwareApplication in `layout.tsx`
- robots.ts, sitemap includes `/setup`

## 10. Accessibility
- Focus rings, reduced motion, skippable onboarding, 44px mobile tap on bottom nav
- Screen-reader pass: **manual, not automated here**

## 11. QA
- Engine unit checks: `npm run test:engines` (`src/engines/engines.test.ts`)
- E2E/load/UAT: **not in this repo**

## 12. DevOps
- CI: lint-less build + engine tests (`.github/workflows/ci.yml`)
- Health endpoint
- Rollback: git revert on Vercel

## 13. Legal
- `/privacy` `/terms` `/cookies` + cookie banner

## 14. Analytics & monitoring
- Hooks documented; **live GA4/Sentry keys not committed** (correct)

## 15. Docs
- README, CHANGELOG, ARCHITECTURE_SPEC, DESIGN_SYSTEM, COMPANY_TYPE_ENGINE, WORKFORCE_OS, this file, OpenAPI

## 16. Pre-launch / 16B global scale
**Not fake-checked:** Redis cluster, multi-region, chaos tests, pentest, 2–5× load. Those are production-ops. The product architecture in this repo is configuration-driven so those layers can attach without rewriting screens.

## Configuration architecture (this phase)
```
Company DNA → Module registry → Role/permission/policy/workflow engines
        → Navigation + dashboard generators → Agentic tools (ACL) → Audit
Data: repository → local dataquery (demo) or Supabase (prod)
```
