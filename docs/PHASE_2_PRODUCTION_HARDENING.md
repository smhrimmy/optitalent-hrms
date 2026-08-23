# OptiTalent — Production Hardening & Completion Master Prompt

You have already completed the first UI/UX/product audit of OptiTalent HRMS.

The latest health report is:

Routes:
28 pass / 40 partial / 1 fail (backups) / remaining system pages pass

Buttons:
dead lockdown fixed; backups still decorative

Forms:
login, security IP, organization and local CRUD pass;
many legacy forms remain unvalidated

Dialogs:
Radix Escape/focus works;
lockdown confirmation added;
unsaved-changes protection missing

Roles:
navigation differs by role;
URL gate exists for non-privileged users;
NO server-side RBAC yet

Responsive:
not lab-tested;
new tables have overflow-x;
44px buttons exist

Accessibility:
labels on new fields;
focus rings;
reduced motion;
NO VoiceOver testing

Loading:
BrandLoader + new skeletons;
many legacy pages still have spinner-or-nothing behavior

Error:
system error pages exist;
module-level fetch errors remain inconsistent

Data:
demo local stores + some Supabase;
NO unified repository/data layer

Security:
lockdown cookie works;
WAF switches are NOT edge-enforced;
MFA is demo-only

Still open:

1. Server-enforced RBAC on every route
2. Workflow runtime
3. Edge WAF / IP deny
4. Field-level permissions
5. Unsaved-changes guards
6. Real backups
7. Sentry / RUM
8. i18n
9. Device and Safari QA
10. AI tool ACL + audit of model actions

IMPORTANT:

Do NOT declare OptiTalent production-ready until these items are either implemented and tested or explicitly documented as blocked by an external dependency.

Do NOT simply update documentation to make the status appear complete.

Actually implement and test the missing functionality.

==================================================
PHASE 1 — ESTABLISH BASELINE
==================================================

Before changing code:

1. Inspect the entire repository.
2. Read:

   docs/PROJECT_CHECKLIST.md
   docs/DESIGN_SYSTEM.md
   docs/UI_UX_AUDIT.md
   docs/UI_UX_FIX_CHECKLIST.md
   docs/ROUTE_INVENTORY.md
   docs/INTERACTION_INVENTORY.md
   docs/QA_MATRIX.md
   docs/FINAL_PRODUCT_HEALTH.md

3. Inspect package.json.
4. Inspect routing.
5. Inspect authentication.
6. Inspect Supabase configuration.
7. Inspect middleware.
8. Inspect dataquery.ts.
9. Inspect all permission-related code.
10. Inspect all API/server routes.
11. Inspect all admin/security code.
12. Inspect workflow-related code.
13. Inspect backup-related code.
14. Inspect AI-related code.

Create:

docs/PRODUCTION_HARDENING_PLAN.md

with:

Feature
Current state
Architecture
Files involved
Implementation plan
Testing plan
Status

Do not begin random edits before understanding the architecture.

==================================================
PHASE 2 — SERVER-SIDE RBAC
==================================================

This is P0.

Current problem:

The UI changes based on role and there is a URL gate, but authorization is not actually enforced server-side.

Implement real authorization.

Architecture:

Request
 ↓
Authentication
 ↓
Tenant identification
 ↓
User identity
 ↓
Role resolution
 ↓
Permission resolution
 ↓
Scope resolution
 ↓
Policy evaluation
 ↓
Route/API authorization
 ↓
Data access
 ↓
Response

Never rely on:

- hidden buttons
- hidden navigation
- frontend role checks
- route redirects alone

A malicious user must not be able to bypass permissions by directly calling an API.

Implement:

RBAC
+
ABAC
+
scope
+
relationship access

Permissions should support:

resource
action
scope
conditions

Examples:

employee.view
employee.create
employee.edit
employee.delete

employee.salary.view
employee.salary.edit

payroll.view
payroll.run
payroll.approve

security.view
security.manage

roles.view
roles.manage

workflows.view
workflows.manage

==================================================
PHASE 3 — FIELD-LEVEL PERMISSIONS
==================================================

Implement the permission model discussed in the product architecture.

Example:

HR Manager:

employee.name.view = true
employee.department.view = true
employee.salary.view = true
employee.salary.edit = false
employee.bank_account.view = false

Payroll:

employee.salary.view = true
employee.salary.edit = true
employee.bank_account.view = restricted

Manager:

employee.profile.view = true
employee.salary.view = false

The same record may therefore expose different fields to different users.

CRITICAL:

Field-level restrictions must exist in the server/data layer.

Do not merely remove fields from React rendering.

Never send unauthorized sensitive fields to the browser.

Create:

src/lib/auth/
src/lib/permissions/
src/lib/policies/

or adapt the existing architecture if equivalent systems already exist.

==================================================
PHASE 4 — PERMISSION SCOPE
==================================================

Permissions must support:

Global
Tenant
Entity
Country
Region
Location
Department
Team
Project
Direct reports
Assigned employees

Example:

Regional HR:

country = India
region = South
employee_scope = assigned_locations

Store Manager:

location = Store-104

Project Manager:

project_members = Project-42

Manager:

relationship = direct_report

Implement reusable scope evaluation.

==================================================
PHASE 5 — SECURITY PAGE
==================================================

Audit:

/admin/super-admin/security

Every security switch must be classified:

REAL
DEMO
NOT IMPLEMENTED

Never present demo-only functionality as real security.

For each setting:

UI
 ↓
State
 ↓
Persistence
 ↓
Server
 ↓
Enforcement
 ↓
Audit

If a switch cannot actually enforce the setting, redesign the UI so it clearly communicates its state.

==================================================
PHASE 6 — EDGE WAF / IP DENY
==================================================

Implement actual IP restriction using the platform's supported edge/server middleware capabilities where technically possible.

Required:

IP allowlist
IP denylist
CIDR support if practical
country/region rules if supported
temporary blocks
permanent blocks
audit trail
reason
created by
created date
expiry
enabled/disabled

Example:

Blocked IP:
203.0.113.20

Reason:
Suspicious activity

Expires:
24 hours

Every request must be evaluated before protected application access where supported.

If Vercel/platform limitations prevent a particular feature, document the exact limitation instead of pretending it is implemented.

==================================================
PHASE 7 — MFA
==================================================

Current MFA is demo-only.

Determine whether the existing architecture supports real MFA.

If possible implement:

TOTP
recovery codes
enrollment
verification
disable/revoke
trusted sessions
audit

Security-sensitive roles should support mandatory MFA.

Do not create fake QR codes or fake verification.

If real MFA requires an external provider, isolate the provider behind an authentication interface.

==================================================
PHASE 8 — WORKFLOW RUNTIME
==================================================

The workflow builder must not remain a visual-only editor.

Implement a real workflow runtime.

Architecture:

Trigger
 ↓
Condition
 ↓
Action
 ↓
Approval
 ↓
Wait
 ↓
Condition
 ↓
Action
 ↓
Complete

Support:

- triggers
- conditions
- branches
- approvals
- notifications
- data updates
- delays
- retries
- failure states
- cancellation
- execution history

Example:

Leave Request
 ↓
Check balance
 ↓
IF <= 2 days
 ↓
Manager approval
 ↓
IF > 2 days
 ↓
HR approval
 ↓
Update leave
 ↓
Notify employee

Create:

Workflow
WorkflowVersion
WorkflowNode
WorkflowEdge
WorkflowExecution
WorkflowExecutionStep

Never execute untrusted workflow code directly.

==================================================
PHASE 9 — WORKFLOW OBSERVABILITY
==================================================

Every workflow execution should expose:

Workflow:
Leave Approval

Execution:
WF-10442

Status:
Completed

Started:
14:02

Completed:
14:03

Steps:

✓ Leave submitted
✓ Balance checked
✓ Manager identified
✓ Manager approved
✓ Leave updated
✓ Employee notified

Failures must show:

Failed step
Reason
Retry option
Available recovery action

==================================================
PHASE 10 — UNSAVED CHANGES
==================================================

Implement reusable unsaved-change protection.

Use it for:

Employee edit
Organization settings
Security settings
Role builder
Permission builder
Policy builder
Workflow builder
Job creation
Candidate evaluation
Performance review
Compensation
Company configuration

Behavior:

User edits
 ↓
Dirty state
 ↓
Attempts navigation
 ↓
Warning

Dialog:

Unsaved changes

"You have changes that haven't been saved."

Actions:

Stay
Discard
Save and continue

Support:

browser back
sidebar navigation
route changes
closing relevant dialogs/drawers

Do not create a global guard that interferes with forms that are not dirty.

==================================================
PHASE 11 — UNIFIED DATA REPOSITORY
==================================================

Current system:

demo local stores
+
some Supabase
+
direct data access

Refactor toward:

UI
 ↓
Domain service
 ↓
Repository
 ↓
Data provider

Providers:

LocalDemoProvider
SupabaseProvider

The UI must not know which provider is being used.

Example:

employeeRepository.getEmployees()

employeeRepository.createEmployee()

employeeRepository.updateEmployee()

employeeRepository.deleteEmployee()

Same interface in demo and production.

Do NOT break demo mode.

==================================================
PHASE 12 — DATA CONSISTENCY
==================================================

Test every module:

Create
Edit
Delete/archive
Refresh
Search
Filter
Navigate away
Return
Login again

Verify state remains correct.

Test:

local/demo mode
Supabase mode

Where Supabase functionality is incomplete, identify exactly which operations are incomplete.

==================================================
PHASE 13 — REAL BACKUPS
==================================================

Do not implement a fake "Backup Now" button.

Determine the actual persistence architecture.

Implement a realistic backup strategy for:

- organization configuration
- employees
- workflows
- policies
- roles
- permissions
- audit data
- application configuration

Support:

backup creation
backup status
backup timestamp
backup size
retention
restore where safely possible

If storage is external, use the appropriate provider abstraction.

Never expose backup credentials in the frontend.

If automated database backups are provided by the hosting/database platform instead, integrate/document that instead of building a misleading application-level backup feature.

==================================================
PHASE 14 — OBSERVABILITY
==================================================

Add production observability.

At minimum:

Error tracking
Performance monitoring
Route performance
API failures
Unhandled exceptions
Promise rejections

Sentry/RUM may be used if available and appropriate.

Do not hard-code secrets.

Use environment variables.

Implement:

production
staging
demo

configuration separately.

Add:

docs/OBSERVABILITY.md

with:

What is monitored
What is not monitored
Environment configuration
PII handling
Alerting
Retention

==================================================
PHASE 15 — I18N FOUNDATION
==================================================

Do not rewrite every translation immediately.

First remove hard-coded user-facing strings from the architecture.

Create:

src/i18n/

Support:

en-IN

and make the system ready for:

en-US
hi-IN
kn-IN
ml-IN
ta-IN

Avoid breaking layout when strings become longer.

Dates, currency and numbers must use locale-aware formatting.

==================================================
PHASE 16 — DEVICE QA
==================================================

Perform actual responsive testing.

Minimum:

320x568
375x667
390x844
414x896
768x1024
1024x768
1280x720
1440x900
1920x1080

Test:

Chrome
Edge
Firefox
Safari where available

Test:

mouse
keyboard
touch

Do not claim Safari is tested if the environment cannot run Safari.

Document unavailable environments honestly.

==================================================
PHASE 17 — TABLE OVERFLOW
==================================================

Current report identifies overflow-x in new tables.

Fix every instance.

For each table choose the correct strategy:

responsive cards
horizontal table scroll
column priority
row expansion
mobile detail drawer

Do not globally add overflow-x-hidden because that merely hides the problem.

==================================================
PHASE 18 — LEGACY LOADING STATES
==================================================

Find every:

"Loading..."
spinner
conditional blank return
undefined render
empty white region

Replace inappropriate states with:

PageSkeleton
TableSkeleton
CardSkeleton
ChartSkeleton
InlineLoader
ButtonLoader
ModalLoader

Every data-fetching screen must support:

loading
success
empty
error

==================================================
PHASE 19 — FETCH ERROR HANDLING
==================================================

Standardize module errors.

Create reusable:

ErrorState

with:

title
description
retry
support/help where relevant

Example:

"Unable to load employees"

"Something went wrong while retrieving employee data."

[Retry]

Do not allow failed queries to silently render empty data.

An empty dataset and a failed request are different states.

==================================================
PHASE 20 — AI TOOL ACL
==================================================

This is mandatory before exposing AI actions.

Architecture:

User
 ↓
AI Assistant
 ↓
Intent
 ↓
Tool
 ↓
Permission check
 ↓
Scope check
 ↓
Data filtering
 ↓
Confirmation if necessary
 ↓
Execution
 ↓
Audit

Example:

AI asks to view salary.

Check:

salary.view

If denied:

AI must refuse.

AI must NEVER use service-level credentials to bypass user permissions.

==================================================
PHASE 21 — AI ACTION RISK LEVELS
==================================================

Classify tools:

LOW RISK
- search
- summarize
- read dashboard

MEDIUM RISK
- create request
- create job
- create onboarding task

HIGH RISK
- modify salary
- terminate employee
- change permissions
- run payroll
- disable MFA
- delete employee

High-risk actions require explicit user confirmation and normal authorization.

==================================================
PHASE 22 — AI AUDIT
==================================================

Log:

user
tenant
agent
tool
arguments
affected records
permission decision
confirmation
result
timestamp
failure

Never log secrets, passwords, tokens or unnecessary sensitive information.

Example:

AI action

Requested by:
HR Manager

Agent:
Onboarding Agent

Tool:
create_onboarding_workflow

Result:
Success

Approval:
Required

Approved by:
HR Director

==================================================
PHASE 23 — BACKUPS ROUTE
==================================================

Current backups UI is decorative.

Do one of two things:

A.
Implement real backups.

OR

B.
Clearly mark the feature as unavailable/planned and remove misleading actions.

Never leave:

"Backup Now"

as a button that does nothing.

==================================================
PHASE 24 — BUTTON COMPLETION
==================================================

Perform another repository-wide search for:

onClick={() => {}}
TODO
FIXME
console.log
alert(
placeholder handlers
fake success
decorative buttons

For each occurrence:

Implement
Remove
or document legitimate development-only behavior.

Do not leave dead controls.

==================================================
PHASE 25 — FORM COMPLETION
==================================================

Find legacy forms without:

validation
loading
error
success
dirty-state detection

Prioritize:

employee
job
candidate
leave
expense
asset
timesheet
performance
organization
role
permission
workflow
security

==================================================
PHASE 26 — ACCESSIBILITY
==================================================

Perform a real accessibility pass.

Check:

WCAG 2.2 AA
keyboard
focus
contrast
labels
landmarks
headings
dialogs
tables
forms
error messages
live regions

Where VoiceOver is unavailable, use available accessibility tooling.

Do not claim VoiceOver tested unless actually tested.

Add automated accessibility tests where practical.

==================================================
PHASE 27 — SECURITY TESTING
==================================================

Attempt to bypass frontend controls.

Examples:

Direct route access
Direct API request
Unauthorized record ID
Unauthorized employee ID
Unauthorized salary access
Unauthorized payroll access
Unauthorized role modification
Unauthorized workflow modification

Expected:

403 / denial.

Never rely on:

display:none
hidden navigation
client role state

==================================================
PHASE 28 — TENANT ISOLATION
==================================================

Verify that Tenant A cannot access:

Tenant B employees
Tenant B payroll
Tenant B documents
Tenant B settings
Tenant B workflows
Tenant B audit logs

Test using direct requests, not only UI navigation.

==================================================
PHASE 29 — AUDIT LOG
==================================================

Sensitive operations must generate audit records:

Login
Logout
Role change
Permission change
Salary change
Employee termination
MFA change
Security setting change
Workflow change
Backup
Restore
AI action

Audit entries should be immutable from normal administrative UI.

==================================================
PHASE 30 — PRODUCT QUALITY PASS
==================================================

After functionality is fixed, perform another complete visual pass.

Inspect:

spacing
alignment
typography
borders
shadows
icons
buttons
cards
tables
forms
modals
drawers
empty states
loading
errors
navigation

Do not introduce unnecessary redesign.

Maintain the existing OptiTalent paper/forest design direction where it is working.

==================================================
PHASE 31 — PERFORMANCE
==================================================

Measure:

initial load
route transition
largest screens
large tables
dashboard rendering
search
charts

Identify:

unnecessary requests
duplicate queries
unnecessary renders
large bundles
blocking resources

Use:

lazy loading
code splitting
memoization
virtualization

only where justified.

==================================================
PHASE 32 — FINAL TEST MATRIX
==================================================

Create:

docs/PRODUCTION_QA_MATRIX.md

Columns:

Feature
Route
Role
Permission
Desktop
Tablet
Mobile
Keyboard
Accessibility
Loading
Empty
Error
Persistence
Security
Audit
Status

Every critical feature must be marked:

PASS
FAIL
BLOCKED

Never use "probably works."

==================================================
PHASE 33 — NO ESTIMATES FOR FINAL STATUS
==================================================

The current report uses estimated counts.

Replace estimates with verified counts wherever possible.

For example:

Routes:
41 discovered
41 tested
39 pass
2 fail

Buttons:
217 discovered
217 tested
211 pass
6 fail

If complete automation is impossible, explicitly state:

"Manual verification required"

Do not call an untested item PASS.

==================================================
PHASE 34 — PRODUCTION READINESS GATES
==================================================

Create explicit gates.

GATE 1
Authentication

GATE 2
Authorization

GATE 3
Tenant isolation

GATE 4
Sensitive data protection

GATE 5
Core CRUD

GATE 6
Payroll

GATE 7
Recruitment

GATE 8
Attendance

GATE 9
Leave

GATE 10
Workflow runtime

GATE 11
Security

GATE 12
AI

GATE 13
Accessibility

GATE 14
Responsive

GATE 15
Observability

GATE 16
Backup/recovery

GATE 17
Performance

GATE 18
Regression

A gate cannot pass if its underlying functionality is only mocked.

==================================================
PHASE 35 — FINAL DOCUMENTATION
==================================================

Update:

docs/UI_UX_AUDIT.md
docs/UI_UX_FIX_CHECKLIST.md
docs/QA_MATRIX.md
docs/FINAL_PRODUCT_HEALTH.md

Create:

docs/PRODUCTION_READINESS.md
docs/PRODUCTION_QA_MATRIX.md
docs/SECURITY_MODEL.md
docs/AI_SECURITY.md
docs/WORKFLOW_RUNTIME.md
docs/DATA_ARCHITECTURE.md
docs/OBSERVABILITY.md

==================================================
FINAL RULE
==================================================

Do not stop after implementing one or two features.

Work through the entire backlog.

Do not say:

"Implemented"

unless the feature is actually implemented.

Do not say:

"Production ready"

while server RBAC, tenant isolation, field permissions, workflow execution, AI authorization or critical security controls remain incomplete.

Do not hide incomplete features behind attractive UI.

Do not remove functionality simply to make tests pass.

Do not create fake backend behavior.

Do not use demo behavior in places where users could reasonably believe it is production security.

At the end provide:

1. What was implemented
2. What was fixed
3. What was tested
4. Exact test counts
5. Remaining failures
6. External blockers
7. Production-readiness status

The final status must be one of:

NOT READY
READY FOR INTERNAL QA
READY FOR BETA
PRODUCTION READY

Only use PRODUCTION READY when every P0/P1 production gate passes.

==================================================
EXECUTION PRINCIPLE
==================================================

Inspect
→ Plan
→ Implement
→ Test
→ Attack the implementation
→ Fix
→ Regression test
→ Document
→ Repeat

Do not merely generate another audit.

Actually modify the repository and close the identified gaps.

## Priority List

| Priority | Work                                   |
| -------- | -------------------------------------- |
| **P0**   | Server RBAC + tenant isolation         |
| **P0**   | Field-level sensitive-data permissions |
| **P0**   | AI tool authorization                  |
| **P0**   | Security enforcement                   |
| **P0**   | Real workflow runtime                  |
| **P1**   | Unified repository/data layer          |
| **P1**   | Unsaved changes                        |
| **P1**   | Error/loading consistency              |
| **P1**   | Real backup/recovery strategy          |
| **P1**   | Observability                          |
| **P1**   | Responsive/device QA                   |
| **P2**   | i18n                                   |
| **P2**   | Visual/micro-interaction polish        |

The most important principle is that **OptiTalent should stop being a frontend application that happens to have HR features and become a permissioned, policy-driven platform underneath the UI**.
