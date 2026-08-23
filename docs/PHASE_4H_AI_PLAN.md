# Phase 4H.9: Manager AI Chief of Staff Implementation Plan

## Goal
Build the Manager AI Chief of Staff as an orchestration layer over the Manager OS. It will proactively surface attention items, support complex capacity/skills queries through chat, and route high-risk actions through proper workflows. It relies strictly on the `PermissionService` and `AI Tool Registry`.

## 4H.9 Implementation Scope

### 1. Manager AI Home (`/manager/ai`)
- **Focus**: Immediate attention and daily briefing.
- **Components**:
  - Daily Manager Brief (Attendance exceptions, goals at risk, capacity issues).
  - Clear "View → Explain → Action" pathways for every surfaced alert.

### 2. Action Center (`/manager/ai/actions`)
- **Focus**: Reviewing recommended interventions.
- **Components**: Needs approval, Recommended, Simulations, Completed.
- **Structure**: Every recommendation must expose Evidence, Impact, Risk, "Why now?", and the Action.

### 3. AI Chat Interface (`/manager/ai/chat`)
- **Focus**: Contextual questioning and scenario simulation (e.g., "Why is my team overloaded?", "What happens if I move Priya to Project B?").
- **Components**:
  - Structured card responses (FACT, SIGNAL, RECOMMENDATION, SIMULATION, ACTION, REQUIRES APPROVAL) instead of walls of text.
  - Integration with the `WhyEngine` (explaining metrics clearly with evidence).

### 4. Security & Trust Model
- The AI will use specialized, authorized tools (e.g., `manager.get_team_capacity`).
- **Critical Constraint**: The AI cannot autonomously execute high-risk actions (compensation, hiring rejection, firing). Actions are prepared by the AI but must be formally submitted through the UI for Workflow approval.
- We will mock comprehensive adversarial tests (`tests/ai/manager-security.test.ts`) to ensure prompt injection and IDOR attempts fail safely.

## User Review Required

> [!CAUTION]
> **Proactive Notifications:** The architecture specifies event-driven proactive AI (e.g., notifying the manager when a capacity shortage is detected). 
> 
> To prevent notification spam, should we implement a daily digest approach for non-critical signals (e.g., "Skill coverage dropped slightly"), while restricting real-time proactive alerts strictly to "Critical" tier events (e.g., "Missing payroll punch")?
> 
> My recommendation is a strict **Daily Digest** for Signals and Recommendations, with real-time alerts reserved only for SLA-breaching workflows.

## Execution Order
1. Build the Manager AI Home / Daily Brief (`/manager/ai`).
2. Build the AI Action Center (`/manager/ai/actions`).
3. Build the Structured Chat Interface (`/manager/ai/chat`).
4. Mock the adversarial security test suite structure.
5. Execute the 4H.9 Security, RBAC, and State Coverage QA Gate.
