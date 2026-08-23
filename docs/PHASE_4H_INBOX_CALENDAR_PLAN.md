# Phase 4H.3 & 4H.4: Manager Inbox & Team Calendar Implementation Plan

## Goal
Build the Manager Inbox and Team Calendar as the central operational hub for line managers, answering "Who needs my attention?" and "What is happening temporally with my team?". These modules must directly interface with the `Universal Request Engine` and `EmployeeContextService` rather than establishing their own separate approval schemas.

## 4H.3 Manager Inbox (`/manager/inbox`)
- **Scope**: Aggregates Leave, Attendance, Expenses, Travel, Employee Requests, Performance Actions, Recruitment tasks, Lifecycle events, and AI recommendations.
- **Data Model**: Will utilize an `ApprovalTask` interface that wraps the underlying workflow engine request.
- **UI Elements**: 
  - A prioritized list exposing: Priority, Source, Employee, Request type, SLA/deadline, Risk, Status, and Action.
  - Quick action buttons (Approve, Reject, Request Changes, Delegate).
  - Bulk action capabilities where structurally safe.
- **Integration**: Actions must hit the Universal Request Engine (mocked for now) which then deposits an event in the `EventRegistry`.

## 4H.4 Team Calendar (`/manager/calendar`)
- **Scope**: Visualizes Leave, Attendance, Shifts, Holidays, 1:1s, Reviews, Interviews, and Offboarding dates.
- **UI Elements**: 
  - Views: Month, Week, Day, Agenda.
  - Filters: Direct vs Matrix, Department, Location, Event Type.
- **Interactivity**: Clicking an event opens a contextual side-drawer that pulls real-time data while respecting field-level permissions (e.g., hiding medical reason details on sick leave).
- **Integration**: The Calendar interacts with the Inbox. For example, if a manager clicks a pending leave request on the Calendar, it opens the Inbox approval flow.

## Verification & QA
- **Mobile First**: The Inbox must support a swipe-to-action layout on mobile breakpoints, maintaining WCAG 2.2 AA standards.
- **Authorization**: A manager must not be able to fetch or approve tasks for employees outside their reporting hierarchy.
- **Persistence**: "Approve" actions must optimistically update the UI, flip the state in the mock store, and render an audit trace.
