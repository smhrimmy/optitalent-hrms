# Phase 4H: Manager OS Implementation Plan

## Goal
Build the Manager OS, a specialized decision-and-action workspace tailored for people managers. The Manager OS must be a projection of the existing Workforce OS engines (`EmployeeContextService`, `PermissionService`, `Workflow Runtime`, etc.) rather than a duplicate parallel system.

## Key Principles
- **No Duplicate Logic**: Rely on existing domain engines and strictly enforce RBAC and ABAC to scope data to the manager's team.
- **Action-Oriented**: The UI should focus on team health, approvals, capacity, and development, rather than basic profile viewing.
- **Mobile First**: Managers often approve leave or handle exceptions on their phones; the UX must reflect this.

## Build Order

### 1. Core Framework & Roster (4H.1 - 4H.2)
- **4H.1 Manager Shell**: Base layout under `/manager/layout.tsx` optimized for management actions.
- **4H.2 My Team (`/manager/team`)**: Live roster, org relationships, matrix management dotted lines, skills, and workload visibility.

### 2. Inbox & Scheduling (4H.3 - 4H.5)
- **4H.3 Manager Inbox (`/manager/inbox`)**: A single unified, prioritized approval/action queue across all modules (leave, expenses, performance).
- **4H.4 Team Calendar (`/manager/calendar`)**: Visibility into team availability, leave, shifts, and events.
- **4H.5 Team Attendance & Exceptions (`/manager/attendance`)**: Managing timesheets, overtime, absences, and regularization.

### 3. Performance & Capacity (4H.6 - 4H.8)
- **4H.6 Performance & 1:1 OS (`/manager/performance`)**: Managing team goals, feedback loops, 1:1s, and review calibration.
- **4H.7 Hiring & Recruiting (`/manager/hiring`)**: Requisition tracking, candidate pipelines, and interview scorecards.
- **4H.8 Team Capacity & Skills (`/manager/skills`)**: Utilizing the Digital Twin to map team skill gaps, headcount needs, and workforce planning scenarios.

### 4. Advanced Tooling & Hardening (4H.9 - 4H.12)
- **4H.9 Manager AI Chief of Staff (`/manager/ai`)**: Extending the AI pipeline to support manager-specific insights (e.g., "Summarize team flight risks") behind strict permission walls.
- **4H.10 Delegation + Matrix (`/manager/delegation`)**: Temporary delegation of approval scopes with an audit trail.
- **4H.11 Mobile & Accessibility**: Hardening the UI.
- **4H.12 Full Manager Regression**: Release gate.

## User Review Required

> [!CAUTION]
> **Data Access Boundaries:** The Manager OS inherently deals with sensitive employee data (salaries, performance reviews). We must rigorously enforce Tenant and Line Manager boundaries at the data fetching layer (`EmployeeContextService`). A manager must not be able to view details of an employee outside their organizational hierarchy unless explicitly authorized via a Matrix/Dotted-line relationship or temporary Delegation.

Are there any specific data sets (e.g., Payroll visibility) that should be strictly excluded from the Manager OS by default?
