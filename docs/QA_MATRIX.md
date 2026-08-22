# QA matrix

Legend: P = pass for that role/surface · F = fail · ~ = partial · — = not applicable · NT = not tested in this environment.

| Feature | Super Admin | HR | Manager | Employee | Mobile | Keyboard | Error | Loading | Empty |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Employees | P | P | P | — | ~ | ~ | ~ | P | ~ |
| Recruitment | P | P | — | — | ~ | ~ | ~ | P | P |
| Attendance | P | P | P | P | ~ | ~ | ~ | ~ | ~ |
| Leave | P | P | P | P | ~ | ~ | ~ | P | ~ |
| Payroll | P | P | — | P | ~ | ~ | ~ | ~ | ~ |
| Performance | P | P | P | ~ | ~ | NT | NT | ~ | ~ |
| Learning | P | P | P | P | ~ | NT | NT | ~ | ~ |
| Expenses | P | P | P | P | ~ | P | — | P | P |
| Assets | P | P | — | — | ~ | P | — | P | P |
| Helpdesk | P | P | P | P | ~ | ~ | ~ | P | P |
| Offboarding | P | P | — | — | ~ | P | — | P | P |
| Security | ~ | — | — | — | ~ | P | P | P | P |
| Settings | P | P | P | P | ~ | P | ~ | — | — |
| Org chart | P | P | — | — | ~ | P | — | — | P |
| Timesheets | P | P | ~ | P | ~ | P | — | P | P |
| Workflows | ~ | — | — | — | ~ | P | — | — | — |
| AI chat | ~ | ~ | ~ | ~ | ~ | ~ | P | P | — |

Expenses/assets/offboarding/timesheets/holidays are **browser stores**, not payroll-grade.

Mobile: layout uses overflow and 44px buttons; **not** device-lab tested at 320–2560.

Security Super Admin is **~** because WAF is intent-only.
