# Goal: Real E2E Synchronization & Full Functional Audit

The objective is to synchronize our E2E Playwright tests with the real OptiTalent application DOM, fix any bugs discovered during this synchronization process, and perform a genuine end-to-end verification across authentication, role-based access, AI security, and critical HR workflows.

## User Review Required
> [!IMPORTANT]
> The current E2E test suite has 35 successful authentication tests, but the application workflow tests (HR Command Center and AI Security) are failing because they rely on placeholder locators that do not match the real UI. This plan proposes synchronizing these locators and expanding the test matrix to achieve a robust runtime verification without fabricating passing tests.

## Proposed Changes

### Phase 1: Route Inventory
* Create `docs/ROUTE_INVENTORY.md` by statically analyzing `src/app`.
* Document every discovered route, its expected role, primary actions, and E2E coverage status.

### Phase 2: DOM Synchronization for Failed Tests
* Inspect `src/app/manager/ai/page.tsx` (and related components) to identify the true accessible labels for the AI composer (e.g., placeholder text, send button).
* Inspect `src/app/hr/page.tsx` (and related components) to identify the true locators for HR Command Center policy exception approvals and dialogs.
* Update `tests/e2e/security/ai.spec.ts` and `tests/e2e/hr/command-center.spec.ts` to use these actual, stable locators.
* If the real application is missing necessary `aria-labels`, `htmlFor/id` pairs, or dialog confirmation states, fix the **application code**, not the test.

### Phase 3: Comprehensive Test Matrix Expansion
* Create additional test files to cover Employee OS and Manager OS workflows (e.g., leave requests, performance reviews).
* Add assertions for API boundaries, tenant isolation (where applicable), and form validation.

### Phase 4: Final Runtime Verification
* Execute `npm run test:e2e` repeatedly, identifying and fixing broken application behaviors along the way.
* Update `docs/FINAL_RUNTIME_TEST_REPORT.md` with the honest results of the expanded test matrix, maintaining the strict requirement of real execution proof.

## Verification Plan
### Automated Tests
* `npx playwright install; npm run test:e2e`
* Tests will be executed with Playwright traces and screenshots enabled for failures to verify exact UI states.
