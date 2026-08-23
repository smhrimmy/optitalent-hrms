| Domain | Status | Severity | Notes |
|---|---|---|---|
| Authentication | CONDITIONAL | - | Basic tests pass, pending real login stress |
| Authorization | PASS | - | Tested in F.1 and F.2 (Repo boundaries) |
| Multi-company | PASS | - | Tested in F.2 (RLS & Context isolation) |
| Session | CONDITIONAL | - | HttpOnly, Secure, SameSite=Lax verified statically |
| IDOR/BOLA | PASS | - | Tested in F.2 |
| Field security | PASS | - | Tested in F.2 (Repository field redaction) |
| API security | CONDITIONAL | - | Pending direct API fuzzing / runtime tests |
| Input validation | CONDITIONAL | - | Static Zod schemas verified, pending runtime fuzzing |
| XSS | CONDITIONAL | - | React DOM auto-escaping verified statically |
| CSRF | CONDITIONAL | - | Server Actions auto-protection verified statically |
| SSRF | CONDITIONAL | - | Pending real internal network proxy tests |
| Secrets | CONDITIONAL | - | Static codebase scan passed |
| Encryption | CONDITIONAL | - | Supabase handles resting encryption |
| Rate limiting | CONDITIONAL | - | Pending real bypass/flood tests |
| Business logic | CONDITIONAL | - | Pending deep workflow tests |
| Workflow | CONDITIONAL | - | Pending true chaos/race-condition tests |
| Payroll | CONDITIONAL | - | Pending transactional integrity checks |
| AI security | CONDITIONAL | - | Pending true prompt injection testing |
| Marketplace | PENDING | - | - |
| RLS | PASS | - | Tested in F.2 |
| Audit | CONDITIONAL | - | Pending log integrity tests |
| Resilience | CONDITIONAL | - | Pending real database load tests |
| Accessibility | PENDING | - | Pending a11y audit |
| Mobile | PASS | - | E2E Playwright tests passed |
| Browser compatibility | CONDITIONAL | - | WebKit, Chrome passed (Firefox timed out) |
| Performance | PENDING | - | Pending real stress testing |
