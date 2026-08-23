# Phase 4G.9 & 4G.10: QA & Full Employee OS Regression Plan

## Goal
Conduct a comprehensive QA and regression pass across the entire Employee OS (Phase 4G) to ensure it meets enterprise production readiness standards before advancing to Phase 4H (Manager OS).

## QA Scope

### 1. Mobile & Layout Hardening (Phase 4G.9)
- **Viewport Testing**: 320px (SE), 375px, 768px (iPad), 1024px, 1280px+.
- **Touch Targets**: Ensure minimum 44px interactable areas.
- **Specific Components**: Bottom navigation, tables (horizontal scrolling), side drawers, dialogs, and the keyboard-safe AI chat composer.

### 2. Accessibility (WCAG 2.2 AA)
- Keyboard-only navigation across all new OS modules (Profile, Career, Performance, Learning, Documents, Notifications, Activity, AI).
- Focus management (trapping in modals/drawers).
- Screen-reader compatibility (aria-labels, live regions for chat/notifications).
- Contrast ratios and `prefers-reduced-motion` compliance.

### 3. Comprehensive Interaction Audit (Phase 4G.10)
- Audit every actionable UI element (buttons, links, forms, popups, dropdowns, modals, drawers, toasts, confirmations).
- Ensure loading, success, and error states are correctly represented without UI jank.

### 4. Security & RBAC Regression
- **Tenant & Scope Isolation**: Verify that an employee cannot access another employee's records via URL manipulation (IDOR).
- **AI Tool Permissions**: Ensure the AI cannot bypass permissions (e.g., executing a salary change tool).
- **Prompt Injection Defense**: Validate that the AI rejects adversarial prompts intended to leak system instructions or bypass controls.
- **Global Kill Switch**: Test that the AI UI fails gracefully when the kill switch is engaged.

### 5. Architectural Integrity
- **Event Integrity**: Ensure the workflow graph holds (Action -> Request -> Approval -> Event -> Notification/Activity -> Digital Twin) without duplicate events.
- **Persistence**: Ensure state remains stable across page refreshes (e.g., "Mark as read" actually persists).
- **Failure Handling**: Simulate 4xx/5xx network errors and ensure the UI recovers or informs the user rather than crashing white.

## Documentation Deliverables
We will update the following existing audit documents with actual `PASS`, `FAIL`, `PARTIAL`, or `N/A` statuses:
1. `ROUTE_INVENTORY.md`
2. `INTERACTION_INVENTORY.md`
3. `QA_MATRIX.md`
4. `UI_UX_FIX_CHECKLIST.md`
5. `FINAL_PRODUCT_HEALTH.md`

## Release Rule
We will not report Phase 4G as complete merely because pages render. We will execute the testing pass, document any P0/P1/P2 issues discovered, fix the P0 issues as a mandatory gate, and produce the final health report before moving to Phase 4H.
