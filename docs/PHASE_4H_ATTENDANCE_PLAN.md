# Phase 4H.5: Team Attendance & Exceptions Implementation Plan

## Goal
Build `/manager/attendance` as a decision workspace for line managers to manage their team's attendance and exceptions. It must not be a standalone calculation engine; instead, it must project the results of the `Time Engine`, `Policy Engine`, and `Payroll` system, allowing the manager to review `calculationTrace` data and approve exceptions.

## 4H.5 Implementation Scope

### 1. Team Attendance Overview
- Visual dashboards showing real-time stats: Present, Absent, Late, On leave, Remote, Missing punch, Overtime.
- Rich filtering capabilities (Direct vs Matrix, Shift, Status, Date).

### 2. Exception Queue & Detail Drawer
- **Priority Tiering**:
  - **Critical**: Missing punches (affects payroll), Unauthorized locations.
  - **High**: Repeated lateness, unapproved overtime.
  - **Normal**: Minor corrections.
- **Explainability**: Every exception will render the `calculationTrace` (e.g., Scheduled vs Actual vs Threshold).
- **Actions**: Approve, Reject, Request correction, View calculation.
- **Detail Drawer**: Upon selecting an employee, it displays today's punches, schedule, trends, and recent exceptions, strictly respecting field-level permissions.

### 3. Payroll & Workflow Connection
- The UI will *request* approval via the `Workflow Runtime` instead of directly mutating payroll tables.
- Approved overtime triggers `payroll.overtime_approved` event for the `Payroll Engine`.

### 4. Safe Bulk Actions
- Support bulk approval/rejection for normal exceptions.
- Critical payroll-affecting exceptions will prompt for individual confirmation or block bulk actions.

### 5. Mobile Manager Experience
- A responsive, swipe-friendly card layout for mobile, moving away from data-heavy tables.
- Flow: Today's Team → Exceptions → Needs Approval → Detail → Action.

## Security & Regression Gates
- **Authorization**: `PermissionService` checks for Direct vs Matrix reporting line isolation.
- **Redaction**: Payroll/salary fields remain redacted unless the manager has explicit elevated privileges.
- **Audit**: Every approval action triggers a trace in the `Event Registry`.

## User Review Required

> [!WARNING]
> **Matrix Manager Approval Authority:** For employees with dotted-line matrix managers, should matrix managers be allowed to approve **payroll-affecting Overtime**, or is that authority strictly reserved for the Direct Line Manager? (Currently, we assume matrix managers have read-only visibility into attendance unless delegated).

## Execution Order
1. Build the Mobile-First Attendance Shell & Overview Dashboard.
2. Build the Exception Queue & `calculationTrace` visualization.
3. Build the Employee Detail Drawer.
4. Implement Optimistic UI Actions hooked to the Workflow payload structure.
5. Execute Security, RBAC, and State Coverage QA.
