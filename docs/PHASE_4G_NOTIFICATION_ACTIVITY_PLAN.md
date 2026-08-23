# Phase 4G.6 & 4G.7: Notifications OS & Activity OS Implementation Plan

## Goal
Build a production-grade Notifications OS (`/employee/notifications`) and Activity OS (`/employee/activity`). These two systems provide distinct views over the same underlying event architecture:
- **Notifications**: "What requires my attention right now?"
- **Activity**: "What happened historically?"

## Existing Infrastructure Audit
- **Models to extend**: `EmployeeContextService`, `EventRegistry`.
- **Components to reuse**: `<ActionCenter />`, `<StatusBadge />`.
- **Underlying Engines**: EventRegistry (for domain events), Workflow Runtime (for approvals).

## Notification OS Implementation

### 1. Domain Model (`EmployeeNotification`)
- **Fields**: `id`, `type`, `category`, `title`, `message`, `priority` (LOW, NORMAL, HIGH, URGENT), `status` (UNREAD, READ, ARCHIVED, EXPIRED), `action` (deep link).
- **Categories**: ACTION_REQUIRED, APPROVAL, PAYROLL, LEARNING, PERFORMANCE, etc.

### 2. Notification Center (`/employee/notifications`)
- Tabs: All, Unread, Action Required.
- Features: Mark as read/unread/all read, actionable deep links.
- **Deep Links**: Links point to source records (e.g., `/employee/performance/123`). Security ensures the record re-checks permissions.

### 3. Notification Preferences (`/employee/notifications/preferences`)
- Channels: In-app, Email, Push.
- Categories toggles. Security-critical alerts cannot be disabled.
- Configurable quiet hours.

## Activity OS Implementation

### 1. Domain Model (`EmployeeActivity`)
- **Fields**: `id`, `category`, `title`, `description`, `occurredAt`, `source`.
- Represents historical events (e.g., Promotion, Course completed, Leave approved).

### 2. Activity Timeline (`/employee/activity`)
- Chronological timeline grouped by date (Today, Yesterday, Earlier).
- Filters: Date range (This month, Custom), Category (Performance, Payroll, etc.).
- Search functionality.
- Detail view drawer/modal for extended event metadata.

## AI Integration & Governance
- AI-generated notifications must clearly identify themselves ("AI Workforce Insight") and explain their reasoning.

## Security & Privacy
- **Tenant & Scope Isolation**: An employee must only see their own notifications and permitted activity.
- **Privacy Filtering**: Manager-only notes or internal HR audits must not leak into the employee's activity feed.

## Testing & QA
- **Mobile First**: Large touch targets (~44px), swipe-to-read where appropriate.
- **Idempotency**: The same domain event must not spawn duplicate notifications.
- **State Persistence**: Marking a notification as read must persist across refreshes.
- Produce `PHASE_4G_NOTIFICATION_QA.md` and `PHASE_4G_ACTIVITY_QA.md` alongside the feature.
