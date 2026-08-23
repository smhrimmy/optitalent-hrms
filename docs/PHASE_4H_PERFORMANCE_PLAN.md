# Phase 4H.6: Performance & 1:1 OS Implementation Plan

## Goal
Build `/manager/performance` and `/manager/one-on-ones` as a continuous performance workspace rather than an annual appraisal form. This module will integrate goals, verified evidence (from the Digital Twin), continuous feedback, and 1:1s into a single, cohesive timeline for the manager.

## 4H.6 Implementation Scope

### 1. Manager Performance Dashboard (`/manager/performance`)
- **Focus**: Continuous, evidence-based performance tracking.
- **Components**: Team goals progress, Verified vs Self-reported progress metrics, Overdue/At-Risk goals, and upcoming review cycles.
- **Rule**: Absolutely no opaque "performance scores"; all metrics must link back to underlying verified evidence.

### 2. Employee Performance Profile (`/manager/performance/[employeeId]`)
- A detailed view for a single direct report containing:
  - Goals (with status)
  - Verified Evidence (pulling from Digital Twin)
  - Feedback stream
  - 1:1 History & Action Items
  - Skill Growth & Development Plan
- **Security Check**: This route must explicitly block access if `employeeId` is not in the manager's authorized hierarchy (Direct or Matrix).

### 3. 1:1 OS (`/manager/one-on-ones`)
- A dedicated workspace for managing continuous check-ins.
- **Features**: Recurring schedules, Agendas, Action Items.
- **Data Boundary**: Crucially, the UI and underlying data model must explicitly split `privateManagerNotes` (never visible to the employee) from `sharedNotes` (visible to both).

### 4. Continuous Feedback & Review Workflow
- **Feedback**: Managers can give/request feedback. Subjective feedback will *not* automatically generate a skill score; it must pass through the Digital Twin verification rules.
- **Review Workflow**: The UI will orchestrate the review cycle (Launch → Self-Review → Manager Review → Calibration) by dispatching events to the existing `Workflow Runtime`.

### 5. AI Chief of Staff Integration
- The AI assistant will be integrated to answer contextual prompts like "Which of Sarah's goals are at risk?" or "Draft 1:1 talking points based on recent feedback."
- **Constraint**: The AI must operate strictly within the `PermissionService` boundaries—it cannot fetch performance data for unauthorized employees.

## User Review Required

> [!WARNING]
> **Matrix Manager Access to Private Notes:** If an employee has a Matrix Manager (dotted line), should the Matrix Manager be able to read the Direct Line Manager's `privateManagerNotes` from 1:1s? (My recommendation is **No**, private notes should strictly belong to the authoring manager to ensure psychological safety).

## Execution Order
1. Build the Manager Performance Dashboard (`/manager/performance`).
2. Build the Employee Performance Profile layout.
3. Build the 1:1 OS (`/manager/one-on-ones`) focusing on the private vs shared state split.
4. Implement the AI Assistant context hooks.
5. Execute Security, RBAC, and State Coverage QA.
