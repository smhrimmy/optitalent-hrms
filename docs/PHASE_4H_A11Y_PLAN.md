# Phase 4H.11: Mobile & Accessibility Hardening Implementation Plan

## Goal
Conduct a comprehensive mobile and accessibility hardening pass across the entire Manager OS, ensuring it is operationally equivalent on all viewports without compromising the authorization and audit boundaries established in previous phases. This is a real implementation and verification pass, not just documentation.

## 4H.11 Implementation Scope

### 1. Responsive Audit & Fixes
- **Viewports**: 320px to 1920px.
- **Targets**: Fix overflow, clipped content, and broken layouts across the Manager OS (Inbox, Attendance, Calendar, Performance, Hiring, Capacity, Skills, Delegation, AI).
- **Mobile First UX**: Ensure bottom navigation and mobile-specific drawers function correctly.

### 2. Touch UX
- Ensure minimum 44px touch targets.
- Fix icon-only actions, table controls, and calendar interactions for mobile touch.

### 3. Keyboard & Screen Reader Support
- Ensure full navigation without a mouse.
- Verify semantic HTML, accessible names, form association, and focus management (especially for dialogs and drawers).
- Add live regions for dynamic AI updates.

### 4. Motion & Reduced Motion
- Verify existing Paper & Ink motion system.
- Add `prefers-reduced-motion` coverage.

### 5. Automated Regression Tests
- Create `tests/e2e/manager-mobile.spec.ts` (Playwright) to verify mobile end-to-end flows.
- Create `tests/security/manager-rbac-regression.test.ts` to ensure accessibility updates do not expose hidden DOM nodes containing sensitive information.

### 6. QA Artifacts Updates
- Update `docs/QA_MATRIX.md`, `docs/FINAL_PRODUCT_HEALTH.md`, `docs/UI_UX_AUDIT.md`, and `docs/UI_UX_FIX_CHECKLIST.md` with verified results.

## User Review Required

> [!CAUTION]
> **Regression Testing Approach:** The user has requested a full Manager OS Regression (4H.12) as part of the release gate.
> 
> My recommendation is to group 4H.11 (Mobile/A11y) and 4H.12 (Full Regression) into a single execution motion, as modifying UI elements for accessibility often requires immediately re-running authorization regression tests to ensure hidden elements aren't inadvertently exposed to screen readers or DOM scraping. Do you agree with treating 4H.11 and 4H.12 as a unified release gate pass?

## Execution Order
1. Execute structural CSS and layout fixes (Mobile overflow, touch targets).
2. Execute structural A11y fixes (ARIA labels, focus management, semantic HTML).
3. Implement `tests/e2e/manager-mobile.spec.ts` and `tests/security/manager-rbac-regression.test.ts`.
4. Run the full Manager OS Regression (Phase 4H.12).
5. Update all QA artifacts.
