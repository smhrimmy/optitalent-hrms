# UI/UX Fix Checklist (Phase 4H: Manager OS)

## Mobile & Touch
- [x] Verify Inbox cards minimum touch targets (44px).
- [x] Fix horizontal overflow on Team Calendar mobile view.
- [x] Ensure Capacity Simulator slider is usable on mobile.

## Keyboard & A11y
- [x] Verify semantic landmarks in Manager Shell (`/manager/layout.tsx`).
- [x] Ensure focus restoration upon closing the Exception Drawer in Attendance.
- [x] Implement `prefers-reduced-motion` in Paper & Ink animation tokens.

## Security & Regression
- [x] Run E2E Mobile Suite (`tests/e2e/manager-mobile.spec.ts`).
- [x] Run RBAC Regression Suite (`tests/security/manager-rbac-regression.test.ts`).
- [x] Verify no sensitive data is hidden via CSS instead of server-side omission.

**Status:** Complete. Ready for Phase 4I (HR Command Center).
