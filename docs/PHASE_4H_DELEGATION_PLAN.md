# Phase 4H.10: Delegation & Matrix Management Implementation Plan

## Goal
Build the Delegation and Matrix Management OS. This phase fundamentally alters the authorization graph of the Manager OS. It introduces temporal, scoped delegation of authority (e.g., covering for a manager on leave) and formalizes matrix relationships (e.g., Project Manager vs Line Manager). 

## 4H.10 Implementation Scope

### 1. Delegation Management (`/manager/delegation`)
- **Focus**: Creating and tracking temporary transfers of authority.
- **Components**:
  - `delegation/create`: UI to define Delegate, Start/End time, Scope (who is covered), and explicit Permissions (e.g., Leave Approval = Yes, Compensation = No).
  - List of active, upcoming, and expired delegations.

### 2. Matrix Relationships (`/manager/relationships`)
- **Focus**: Defining the non-linear org chart.
- **Rule**: Distinguish *Relationship* from *Authorization*. Being a "Project Manager" does not automatically grant "View Salary" permissions.

### 3. Effective Access Simulator (`/admin/security/access-simulator`)
- **Focus**: A diagnostic tool for HR and Admins to verify the complex authorization graph.
- **Function**: You input a User (Manager B) and an Employee (Employee 1042), and the simulator outputs the exact effective permissions and a "Why?" explanation (e.g., "Active delegation from Manager A from Aug 25-30").

### 4. Inbox Integration
- The Manager Inbox (`/manager/inbox`) will be updated to explicitly flag delegated work (e.g., "Originally assigned to Sarah. Currently delegated to Ravi. Expires in 2 days").

## Core Security Rules
- **Intersection Principle**: Effective Permission = Base Permissions ∩ Delegated Permissions ∩ Employee Scope ∩ Tenant Scope.
- A delegation must *never* expand access beyond what the delegator possesses.
- Timezone and midnight expiration boundaries must be strictly enforced.

## User Review Required

> [!CAUTION]
> **Delegation Chaining:** If Manager A delegates to Manager B, can Manager B then delegate Manager A's scope to Manager C if Manager B also goes on unexpected leave?
> 
> My strong technical recommendation is **NO (Block Delegation Chaining)**. Allowing chains makes the effective access graph extremely brittle and poses significant security auditing risks. If Manager B goes on leave, the original delegator (or an Admin) must explicitly create a new delegation to Manager C. Do you agree to explicitly block delegation chaining?

## Execution Order
1. Build the Effective Access Simulator (`/admin/security/access-simulator`) to visualize the rules.
2. Build the Delegation Hub and Create flows (`/manager/delegation`).
3. Build the Matrix Relationships view (`/manager/relationships`).
4. Update the Manager Inbox UI to flag delegated items.
5. Execute the 4H.10 Security, RBAC, and State Coverage QA Gate, focusing on boundary tests (timezones, revoked access).
