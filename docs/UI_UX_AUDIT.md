# UI/UX audit (22 Aug 2026)

Inspected: this repository (branch `cursor/ui-ux-product-polish-4b8c`) and the production hostname `optitalent-hrms-alpha.vercel.app` (that host tracks **main**, which lags this PR). Findings below are about the code in this repo.

Visual language kept: forest ink on paper, Fraunces + Source Sans 3. Not a purple SaaS restyle.

## Architecture

- Next.js App Router. Role is a path segment `/{role}/…`.
- Demo auth: `@optitalent.com` + `password123` via `useAuth().login` and sessionStorage.
- Live auth: Supabase. RLS in SQL; the UI still calls the client SDK from pages (no repository layer).
- Feature flags: `use-features` + localStorage. Nav hides flagged modules; **pages remain reachable by URL**.
- Dual `optitalent-hrms/backend` Prisma app is not what Vercel deploys.

## P0

1. Super Admin Security: switches and IP block were React state only; System Lockdown had no handler. **Fixed this pass** (local persist + lockdown cookie + honest WAF labels).
2. `/admin/super-admin/security` is `/{role}/super-admin/security` with `role=admin`. It existed; it did not persist. **Fixed persist.**
3. Production `optitalent-hrms-alpha` will not show this until **main** is updated.

## P1

- Expenses, assets, timesheets, org chart, offboarding, holidays, workflows, audit, admin configuration hub: advertised in product language / feature flags, **no routes**. **Added local CRUD sketches** (browser persist). Not Supabase ledgers.
- Settings “saved” was `console.log` + toast. **Now writes localStorage.**
- Command palette missed payroll/security/expenses actions. **Extended.**
- Role URL spoofing (`/admin/…` while logged in as employee). **Client redirect** for non-privileged roles.
- Offline: no banner. **Added.**
- Session expiry: silent null user. **Event + overlay.**
- MFA toggle did nothing. **Demo gate `/mfa` code 000000.**
- Tables overflow on narrow screens. Partially addressed with `overflow-x-auto` on new tables; older tables still scroll horizontally.
- Field-level permissions: **not implemented.**
- Workflow **execution engine**: **not implemented** (sketches only).
- AI permission pipeline (tool ACL + audit of model actions): **not implemented** beyond copy.
- Server-side RBAC on Next routes: **not implemented** (client layout + RLS only).

## P2

- Sidebar active state missed nested URLs. **startsWith fix.**
- Hard-coded decorative metrics on dashboards (AHT, FCR) are **demo figures**, not labeled as such everywhere.
- Mixed toast systems (sonner + shadcn).
- Mobile bottom nav is Home / Attendance / Feed / Profile — not Inbox/Requests as specified. **Not fully redesigned** (would drop Feed).

## P3

- Duplicate `/employee` vs `/employees`.
- `next lint` broken on this canary.
- Visual regression screenshots at 9 widths: **not captured in CI.**

## What was not built (blockers)

| Item | Reason |
| --- | --- |
| Visual workflow runtime | No job queue / engine in this app |
| Edge IP deny from Security UI | Would need KV/WAF; list is local |
| True WAF | Hosting product, not a switch |
| Field-level ACL | Schema + every query |
| i18n / RTL | No message catalog |
| Safari/Firefox matrix | This agent environment is Chrome-class |
| 80% unit tests | No test runner in package.json |
| VoiceOver pass | No assistive-tech session |
