# UI/UX fix checklist

Severity: P0 blocking · P1 serious · P2 quality · P3 polish.
Status after this PR.

| ID | Sev | Category | Issue | Status |
| --- | --- | --- | --- | --- |
| 1 | P0 | Security-sensitive UI | Security lockdown dead | Fixed — cookie + confirm |
| 2 | P0 | Data persistence | Security switches lost on refresh | Fixed — localStorage |
| 3 | P0 | Authentication | MFA switch decorative | Partial — demo OTP 000000 |
| 4 | P1 | Navigation | Missing expenses/assets/timesheets/org/offboarding/holidays | Fixed — local modules + nav |
| 5 | P1 | Super Admin | No audit trail for security | Partial — local audit log |
| 6 | P1 | Settings | Save was console.log | Fixed — localStorage |
| 7 | P1 | Search | Command palette incomplete | Partial — more actions |
| 8 | P1 | Authorization | Role in URL not checked | Partial — client gate |
| 9 | P1 | Offline states | No offline UI | Fixed — banner |
| 10 | P1 | Authentication | Session drop with no copy | Partial — overlay on SIGNED_OUT |
| 11 | P1 | Forms | IP block accepted empty/garbage | Fixed — IPv4 check |
| 12 | P1 | Destructive actions | No confirm on lockdown | Fixed |
| 13 | P1 | Loading | Security page no skeleton | Fixed — pulse |
| 14 | P1 | Empty states | New modules empty tables | Fixed — EmptyState |
| 15 | P1 | Demo-mode | Records vanished on refresh | Fixed — local collections |
| 16 | P2 | Navigation | Nested route not active | Fixed |
| 17 | P2 | Currency | INR/USD mixed | Partial — org config + preview |
| 18 | P2 | AI interfaces | No permission copy | Partial — banner |
| 19 | P2 | Mobile | Bottom nav not Inbox/Requests | Open — kept Feed |
| 20 | P2 | Tables | Desktop tables on 320px | Partial — overflow-x on new tables |
| 21 | P2 | Charts | Demo KPIs unlabeled | Open |
| 22 | P2 | Toasts | Two toast systems | Open |
| 23 | P3 | Motion | Fine | Kept reduced-motion |
| 24 | P0 | API/backend RBAC | Next routes unauthenticated | Open — needs server middleware auth |
| 25 | P0 | Workflows | No engine | Documented — sketches only |
| 26 | P1 | Import/upload | No virus scan | Open |
| 27 | P1 | Unsaved changes | No dirty-form guard | Open |
| 28 | P1 | Pagination | Most tables unpaginated | Open |
| 29 | P2 | Dark mode | Some green/blue status cards | Open |
| 30 | P1 | Keyboard | Not fully tested | Partial — cmdk + tab on new forms |

Open items are in `FINAL_PRODUCT_HEALTH.md`. Do not treat Open as shipped.
