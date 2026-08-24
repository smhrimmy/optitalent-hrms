# ROLE PERMISSION MATRIX

This matrix defines the required Global Multi-Company Role & Access Control System.

## Baseline Roles
1. **Platform Owner / Super Admin**
2. **Company Owner**
3. **HR Director**
4. **Manager**
5. **Employee**

## Permission Matrix (Target Enforcements)

| Module | Action | Platform Owner | Company Owner | HR Director | Manager | Employee |
|---|---|---|---|---|---|---|
| **Platform** | Manage Companies | ALLOW | DENY | DENY | DENY | DENY |
| **Settings** | Configure Modules | ALLOW | ALLOW | DENY | DENY | DENY |
| **Users** | Manage Roles/Users | ALLOW | ALLOW | ALLOW (Scoped) | DENY | DENY |
| **Employee** | Create/Update | ALLOW | ALLOW | ALLOW | DENY | DENY |
| **Employee** | Read Profile | ALLOW | ALLOW | ALLOW | ALLOW (Team) | ALLOW (Self) |
| **Attendance** | Clock In/Out | N/A | ALLOW (Self) | ALLOW (Self) | ALLOW (Self) | ALLOW (Self) |
| **Attendance** | Approve/Correct | ALLOW | ALLOW | ALLOW | ALLOW (Team) | DENY |
| **Leave** | Request | N/A | ALLOW (Self) | ALLOW (Self) | ALLOW (Self) | ALLOW (Self) |
| **Leave** | Approve | ALLOW | ALLOW | ALLOW | ALLOW (Team) | DENY |
| **Payroll** | Run Payroll | ALLOW | ALLOW | ALLOW | DENY | DENY |
| **Payroll** | View Payslips | ALLOW | ALLOW | ALLOW | DENY | ALLOW (Self) |
| **Performance**| Manage Cycles | ALLOW | ALLOW | ALLOW | DENY | DENY |
| **Performance**| Submit Review | N/A | N/A | N/A | ALLOW (Team) | ALLOW (Self) |

## Implementation Notes
- **Scope Model**: Roles must be evaluated against the active company and scope (Global, Company, Department, Direct Reports, Self).
- **Enforcement**: Permissions must be checked at the backend data/mutation layer, not just hidden in the UI.
