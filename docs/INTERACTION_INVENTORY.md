# Interaction inventory

Sampled this PR. Not a pixel-complete button census of every legacy module.

| Control | Location | Result | Notes |
| --- | --- | --- | --- |
| Sign in | `/login` | PASS | Demo + Supabase |
| Forgot password | `/login` | PASS | reset mail |
| Google OAuth | `/login` `/signup` | PARTIAL | Needs Google provider in Supabase |
| ⌘K palette | header | PASS | Pages + extra actions |
| Post Job | dashboard | PASS | recruitment |
| Process Payroll | dashboard | PASS | payroll |
| New Post | dashboard | PASS | feed |
| Redeem | dashboard | PASS | recognition |
| Security lockdown | security | PASS | confirm + cookie |
| WAF switches | security | PARTIAL | persist, not edge WAF |
| Block IP | security | PARTIAL | local list, IPv4 validated |
| Feature flags | admin-config | PASS | localStorage |
| Org save | admin/settings | PASS | local |
| Account save | settings | PARTIAL | local, not Supabase profile |
| Add expense/asset/hours | new modules | PASS | local CRUD + confirm delete |
| Helpdesk New Ticket | helpdesk | PARTIAL | dialog; demo cannot post to DB |
| Apply leave | leaves | PARTIAL | needs employee row |
| Clock in | attendance/dashboard | PARTIAL | needs Supabase user |
| System Lockdown (old) | security | FAIL→PASS | was dead |
| Backups run | backups | FAIL | decorative |
| Analytics Apply Filters | analytics | PASS | toast, demo data |
| AI chat send | chatbot | PARTIAL | model; no ACL tools |
| Logout | sidebar | PASS | |
| Cookie Accept | banner | PASS | |
| Escape on dialogs | Radix | PASS | library default |

Keyboard: Tab/Enter on new forms PASS. Full app without mouse: PARTIAL.

Drag/drop: resume parse / walk-in camera — PARTIAL (existing).
