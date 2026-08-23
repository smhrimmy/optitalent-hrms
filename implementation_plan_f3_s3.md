# OptiTalent F.3 Gauntlet: Stage 3 (Steps 15-20)

This is the final phase of the F.3 Runtime Gauntlet. Our objective is to execute the remaining 6 steps against the real local/staging environment and generate the final production release gate report. 

## User Review Required

> [!WARNING]
> This is the final gate before declaring production readiness. I will not declare `RUNTIME PASS` for any step without concrete runtime evidence. Any blocked or static results will be strictly flagged as `PENDING` or `CONDITIONAL RELEASE`.

## Open Questions

> [!IMPORTANT]
> 1. For Step 16 (Real performance/load test), our previous load test (Step 9) hit the API concurrently. Do you want to run a heavier tool like `k6` or `artillery`, or is a robust Node script hitting the frontend routes and APIs concurrently sufficient for this stage?
> 2. For Step 19 (Payroll integrity), do we have synthetic payroll data in our local Supabase instance to test transactional boundaries, or should I generate mock payroll ledgers during the test?

## Proposed Changes

### 1. Step 15: Accessibility Audit
- Use `axe-core` via a Playwright/Puppeteer script to scan the major routes (`/employee/dashboard`, `/hr/command-center`, `/manager/team`).
- Log any critical violations (contrast, ARIA, focus traps).

### 2. Step 16: Real Performance/Load Test
- Expand the API concurrency ramp from Step 9 into a sustained load script simulating 1000+ requests.
- Target read-heavy routes and expensive DB queries to ensure latency remains under 500ms.

### 3. Step 17: Firefox Investigation
- Debug and resolve the known `NS_ERROR_REDIRECT_LOOP` and `/hr/operations` timeout issues specifically in Firefox.
- Write a Playwright script configured with the Firefox engine to verify the loop is eliminated.

### 4. Step 18: Real RLS Data Isolation
- Execute queries using raw Supabase clients signed in as specific users (Company A vs Company B) to bypass the Next.js API layer entirely.
- Verify that `supabase.from('employees').select('*')` organically filters out cross-company rows purely at the PostgreSQL level.

### 5. Step 19: Payroll Transactional Integrity
- Simulate concurrent updates to a user's salary or payroll ledger.
- Verify that race conditions do not result in double payouts or corrupted financial states (testing for PostgreSQL transaction isolation / `FOR UPDATE` locks).

### 6. Step 20: Final Staging Sign-Off
- Compile the results of Stages 1, 2, and 3 into the master `FINAL_RUNTIME_TEST_REPORT.md`.
- Evaluate the final release gate status (Production Ready vs Conditional Release).

## Verification Plan

### Automated Tests
- `npx tsx tests/scripts/f3-gauntlet-s3-a11y.ts`
- `npx tsx tests/scripts/f3-gauntlet-s3-load.ts`
- `npx tsx tests/scripts/f3-gauntlet-s3-rls.ts`
- `npx playwright test --project=firefox`

### Manual Verification
- Reviewing the final consolidated test evidence document.
