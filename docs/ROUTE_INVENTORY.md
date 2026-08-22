# Route inventory

`page.tsx` files under `src/app`. Role `admin` produces `/admin/super-admin/security`.

| Route | Purpose | Role (nav) | Loading | Empty | Error | Data | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Marketing / demo entry | public | n/a | n/a | n/a | static | Pass |
| `/login` | Sign in / up | public | overlay | n/a | toast | Supabase + demo | Pass |
| `/signup` | Alternate sign up | public | overlay | n/a | toast | Supabase | Pass |
| `/mfa` | Demo step-up | public | n/a | n/a | toast | sessionStorage | Partial |
| `/dashboard` | Tenant dashboard / demo bounce | signed-in | BrandLoader | n/a | toast | Supabase | Pass |
| `/{role}/dashboard` | Role home | all | n/a | events empty copy | n/a | mock KPIs | Partial (demo metrics) |
| `/{role}/employees` | Directory | HR+ | spinner | mock fallback | toast | Supabase/mock | Pass |
| `/{role}/employees/[id]` | Person file | HR+ | page | n/a | n/a | mixed | Partial |
| `/{role}/recruitment` | Applicants | HR/recruiter | spinner | EmptyState | demo rows | Supabase/demo | Pass |
| `/{role}/recruitment/[id]` | Candidate | HR | n/a | n/a | n/a | mixed | Partial |
| `/{role}/recruitment/parse` | Resume parse | HR | button | n/a | toast | Genkit | Partial |
| `/{role}/leaves` | Leave | staff | spinner | empty list | toast | Supabase | Partial |
| `/{role}/attendance` | Clock | staff | n/a | n/a | toast | Supabase | Partial |
| `/{role}/attendance/regularize` | Correction | staff | n/a | n/a | n/a | mixed | Partial |
| `/{role}/payroll` | Pay | finance/HR | n/a | n/a | n/a | mixed | Partial |
| `/{role}/performance` | Reviews | manager+ | n/a | n/a | n/a | mixed | Partial |
| `/{role}/learning` | Courses | staff | n/a | n/a | n/a | mixed | Partial |
| `/{role}/recognition` | Points | staff | n/a | n/a | n/a | mixed | Partial |
| `/{role}/helpdesk` | Tickets | staff | spinner | demo tickets | toast | Supabase/demo | Pass |
| `/{role}/company-feed` | Posts | staff | n/a | n/a | n/a | Supabase | Partial |
| `/{role}/settings` | Account | staff | n/a | n/a | toast | localStorage | Partial |
| `/{role}/admin/settings` | Org config | admin | n/a | n/a | toast | localStorage | Pass (local) |
| `/{role}/admin-config` | Feature flags | admin | n/a | n/a | n/a | localStorage | Pass (local) |
| `/{role}/super-admin/security` | Security policy | admin | pulse | empty IP list | toast | localStorage + cookie | Partial (honest WAF) |
| `/{role}/super-admin` | SA home | SA | n/a | n/a | n/a | mock | Partial |
| `/{role}/super-admin/tenants` | Tenants | SA | n/a | n/a | n/a | mixed | Partial |
| `/{role}/super-admin/backups` | Backup UI | SA | n/a | n/a | n/a | decorative | Fail — not a real backup |
| `/{role}/super-admin/server-health` | Health UI | SA | n/a | n/a | n/a | mixed | Partial |
| `/{role}/analytics` | Charts | manager+ | timeout mock | n/a | n/a | demo | Partial |
| `/{role}/reports` | Reports | manager | n/a | n/a | n/a | mixed | Partial |
| `/{role}/onboarding` | Candidates | HR | n/a | n/a | n/a | mixed | Partial |
| `/{role}/shifts` | Shifts | staff | n/a | n/a | n/a | mixed | Partial |
| `/{role}/assessments` | Tests | staff | n/a | n/a | n/a | mixed | Partial |
| `/{role}/profile` | Me | staff | n/a | n/a | n/a | mixed | Partial |
| `/{role}/ai-tools/chatbot` | Chat | flagged | spinner | n/a | message | Genkit | Partial |
| `/{role}/ai-tools/career-predictor` | Predict | flagged | n/a | n/a | n/a | Genkit | Partial |
| `/{role}/developer-panel` | Dev | admin | n/a | n/a | n/a | mixed | Partial |
| `/{role}/expenses` | Claims | flagged | pulse | EmptyState | n/a | local | Pass (local) |
| `/{role}/assets` | Inventory | flagged | pulse | EmptyState | n/a | local | Pass (local) |
| `/{role}/timesheets` | Hours | flagged | pulse | EmptyState | n/a | local | Pass (local) |
| `/{role}/org-chart` | Hierarchy | flagged | n/a | EmptyState | n/a | local | Pass (local) |
| `/{role}/offboarding` | Exit | HR | pulse | EmptyState | n/a | local | Pass (local) |
| `/{role}/holidays` | Holidays | HR | pulse | EmptyState | n/a | local | Pass (local) |
| `/{role}/workflows` | Sketches | admin | n/a | n/a | n/a | local | Partial — not executed |
| `/{role}/audit` | UI audit | admin | n/a | empty copy | n/a | local | Partial |
| `/privacy` `/terms` `/cookies` `/help` `/contact` `/accessibility` | Legal | public | n/a | n/a | n/a | static | Pass |
| `/errors/*` `/offline` `/session-expired` `/suspended` `/coming-soon` `/unsupported` `/empty-search` `/payment-failed` | System | public | n/a | n/a | n/a | static | Pass |
| `/walkin-drive*` | Hiring event | public | n/a | n/a | n/a | mixed | Partial |
| `/applicant/[id]` | Applicant portal | public | n/a | n/a | n/a | mixed | Partial |
| `/api/health` | Liveness | n/a | n/a | n/a | 200 | n/a | Pass |
| `/api/openapi` | Spec | n/a | n/a | n/a | 200 | n/a | Pass |
| `/api/keepalive` | Heartbeat | key | n/a | n/a | 401/503 | Supabase | Pass |
| `/api/tenants/provision` | Tenant | admin key | n/a | n/a | 503 | Supabase | Partial |
| `/maintenance` | Flag | public | n/a | n/a | n/a | static | Pass if flag |
| `/demo/errors` | Gallery | public | n/a | n/a | n/a | static | Pass |

Keyboard / mobile columns: new forms tab-ok; full matrix not run on device lab.
