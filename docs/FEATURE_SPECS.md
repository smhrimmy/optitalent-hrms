
# Feature Specifications & Roadmap

## 1. Authentication & Onboarding
### User Story
As a user, I want to securely sign up and log in so that I can access my company's data.

### Technical Spec
*   **Sign Up**: Create `auth.users` record -> Trigger `handle_new_user` -> Insert `public.users`.
*   **Sign In**: Email/Password + Optional Google OAuth.
*   **MFA**: Require TOTP for `admin` and `hr` roles.
*   **Role Redirect**:
    *   `super-admin` -> `/super-admin`
    *   `admin`/`hr` -> `/dashboard`
    *   `employee` -> `/portal`

## 2. Multi-Tenant Dashboard
### User Story
As a Tenant Admin, I want a centralized view of my company's health.

### Technical Spec
*   **Widgets**:
    *   `Total Employees` (Count query).
    *   `Leave Requests Pending` (Filter by `status='Pending'`).
    *   `Open Positions` (Filter by `status='Open'`).
    *   `Recent Activity` (Feed from `audit_logs` or `notifications`).
*   **Data Fetching**: Use SWR with `revalidateOnFocus` for real-time updates.

## 3. Employee Management (HR Core)
### User Story
As an HR Manager, I want to onboard new employees and manage their profiles.

### Technical Spec
*   **Profile**: Personal info, job title, department, manager, contact details.
*   **Documents**: Upload resumes/contracts to Supabase Storage (`/documents/{tenant_id}/{user_id}`).
*   **Hierarchy**: Visualize reporting structure (Org Chart).

## 4. Leave Management
### User Story
As an Employee, I want to request time off and see my remaining balance.

### Technical Spec
*   **Request Form**: Date range picker, leave type selector, reason text area.
*   **Validation**: Check `leave_balances` before submission.
*   **Approval Workflow**: Manager gets notification -> Approve/Reject -> Update balance transactionally.

## 5. Recruitment (ATS)
### User Story
As a Hiring Manager, I want to track applicants through the interview process.

### Technical Spec
*   **Job Board**: Public page listing open roles (`/careers/{tenant_slug}`).
*   **Kanban Board**: Drag-and-drop interface for applicant status (`Applied` -> `Interview` -> `Offer`).
*   **Notes**: Private comments on candidate profiles visible only to interviewers.

## 6. Helpdesk Ticketing
### User Story
As an Employee, I want to report IT issues or ask HR questions.

### Technical Spec
*   **Ticket Creation**: Subject, Priority (`Low`, `Medium`, `High`), Category.
*   **SLA Tracking**: Auto-escalate tickets open > 48 hours.
*   **Messaging**: Chat-like interface for ticket updates.

## 7. Performance Reviews
### User Story
As a Manager, I want to evaluate my team's performance periodically.

### Technical Spec
*   **Review Cycle**: Quarterly/Annual periods.
*   **Rating Scale**: 1-5 or custom enum (`Exceeds Expectations`, etc.).
*   **Goals**: Set objectives for the next period.

## 8. Payroll (MVP)
### User Story
As an Employee, I want to view my payslips.

### Technical Spec
*   **History**: List of past payments.
*   **Payslip**: PDF generation or download link from secure storage.
*   **Admin View**: Upload CSV for bulk payroll processing (Phase 2).

## 9. Future Enhancements (Phase 2)
*   **AI Analytics**: Predictive attrition modeling.
*   **Mobile App**: React Native companion.
*   **Slack Integration**: Notifications and commands.
*   **Custom Domain Support**: `hr.acme.com` mapping via Vercel Domains API.
