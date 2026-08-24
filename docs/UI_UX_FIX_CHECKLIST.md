# UI/UX FIX CHECKLIST

## P0 (Critical - Broken/Security/Blocking)
- [ ] **Multi-Tenant Role Enforcements**: Hardcoded UI roles must be moved to backend data-layer checks based on Company + User Role matrix.
- [ ] **Attendance Engine Overhaul**: Must support 24/7 crossing-midnight shifts, configurable policies (half-day thresholds, grace periods), and idempotent events (prevent double clock-ins).
- [ ] **Route Guards**: Ensure all 155 discovered routes have appropriate RLS/Server-side guards, not just client-side redirects.

## P1 (Major Usability & Functional)
- [ ] **Mobile-First Redesign (Employee Home)**: Remove oversized headings, tighten cards, prioritize attendance status and primary actions for viewports (320px-414px).
- [ ] **Mobile-First Redesign (Manager/Admin)**: Ensure actionable items (approvals, staffing gaps) are above the fold without horizontal scrolling.
- [ ] **Form Validations**: Replace generic "Invalid input" with specific, actionable messages across Core HR forms.
- [ ] **Data Consistency**: Ensure offline gracefully fails and duplicate submissions are blocked during loading states.

## P2 (Noticeable Quality)
- [ ] **Empty States**: Replace blank tables with actionable empty states (e.g., "No employees found. [Import CSV]").
- [ ] **Loading Skeletons**: Replace generic "Loading..." text with structural skeletons in dashboards and tables.
- [ ] **Table Responsiveness**: Add horizontal scroll wrappers or bottom-sheet details for dense tables on mobile.
- [ ] **Confirmation Modals**: Replace "Are you sure?" with context-specific warnings for destructive actions.

## P3 (Polish & Micro-interactions)
- [ ] **Button States**: Ensure all primary actions have visual pressed/loading/disabled states.
- [ ] **Typography & Tabular Nums**: Apply tabular-nums to payroll and attendance time metrics for alignment.
- [ ] **Toast Notifications**: Standardize duration and clear, actionable messaging.
