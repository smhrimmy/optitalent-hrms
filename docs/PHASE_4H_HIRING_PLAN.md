# Phase 4H.7: Hiring & Recruiting OS Implementation Plan

## Goal
Build `/manager/hiring` as a decision workspace for managers to track requisitions, candidates, and interviews. This module will integrate deeply with the Workforce Planning engines, the Digital Twin (for skills matching), and the Employee Lifecycle (for converting candidates to employees).

## 4H.7 Implementation Scope

### 1. Manager Hiring Dashboard (`/manager/hiring`)
- **Focus**: Tracking open requisitions, pipeline velocity, and candidates requiring immediate action.
- **Components**: 
  - Overview metrics (Time-to-hire, Pipeline health).
  - List of active Requisitions.
  - Action items (e.g., Offers awaiting approval, Interviews to score).

### 2. Requisition Detail (`/manager/hiring/[requisitionId]`)
- Detailed view of a specific open role.
- **Context**: Explicitly answers "Why are we hiring?" by linking back to Workforce Planning data (e.g., backfill vs. growth).
- **Pipeline**: A visual board of candidates in various stages.

### 3. Candidate & Interview Workspace (`/manager/hiring/[requisitionId]/[candidateId]`)
- **Candidate View**: Profile, resume, extracted skills, and pipeline stage. Crucially separates verified info from AI inferences.
- **Interview OS**: Structured scorecards based on job-relevant competencies. Includes conflict/duplicate submission prevention and protects unsaved notes.

### 4. AI Hiring Assistant
- Assists in matching candidates to required skills.
- **Critical Constraint**: AI recommendations must explicitly prevent ranking or filtering based on protected characteristics (race, gender, age, etc.). It serves as decision support, not an autonomous decider.

### 5. Offer & Lifecycle Conversion
- Moving a candidate to "Hired" validates compensation against established bands (preventing arbitrary entries) and triggers the `Lifecycle Engine` to begin onboarding.
- Ensures a candidate seamlessly converts to an employee record in the Digital Twin without duplication.

## User Review Required

> [!CAUTION]
> **AI Bias & Protected Characteristics:** To enforce the requirement that AI does not rank based on protected characteristics, we will implement a strict data-sanitization layer before sending candidate profiles to the AI context window. The AI will only receive anonymized skills, experience, and structured assessment scores. 
> 
> **Are there any specific "Nice-to-have" skills or attributes that should also be scrubbed to prevent proxy bias (e.g., graduating from specific universities)?**

## Execution Order
1. Build the Hiring Dashboard (`/manager/hiring`).
2. Build the Requisition Pipeline view (`/manager/hiring/[requisitionId]`).
3. Build the Candidate & Interview Workspace focusing on structured scorecards.
4. Implement the Offer workflow and Lifecycle conversion trigger.
5. Execute Security, RBAC, and State Coverage QA.
