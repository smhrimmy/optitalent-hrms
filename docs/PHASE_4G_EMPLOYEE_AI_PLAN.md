# Phase 4G.8: Employee AI / Personal Workforce Chief of Staff Implementation Plan

## Goal
Build a permission-aware Employee AI / Personal Workforce Chief of Staff that sits above the existing Employee OS. It should act as an intelligent assistant to explain policies, recommend learning, summarize goals, and prepare requests. It must NOT be a generic chatbot with unrestricted database access or autonomous HR authority.

## Existing Infrastructure Audit
- **Models & Services to reuse**: `EmployeeContextService`, `Universal Request Engine`, `Digital Twin`, `Skills Engine`, `PermissionService`, `AI Tool Registry`, `AI Execution Pipeline`, `Global AI Kill Switch`, `EventRegistry`.
- **UI Components to reuse**: `<DocumentCard>`, `<CourseCard>`, `<GoalCard>`, `<ActionCenter>`.

## Core Features & Architecture

### 1. AI Home & Chat UI (`/employee/ai`)
- **Home View**: A concise "Workforce Assistant" home showing quick actions (My tasks, My leave, My documents) and recent insights (e.g., "1 document expiring").
- **Chat Interface**: Support for typed queries, message history, structured action cards (AnswerCard, RequestCard, EvidenceCard), and stop/retry interactions.
- **Explainability**: Clear visual distinction between FACT, RECOMMENDATION, ACTION, and REQUIRES APPROVAL. Evidence citations will be exposed clearly.

### 2. Tools & Capability Layer
- Tools are risk-tiered (Tier 0: Read Profile/Notifications, Tier 1: Generate explanation/learning recs, Tier 2: Prepare leave/expense requests, Tier 3+: Blocked).
- The AI does not modify data autonomously. For actions (e.g., Requesting a Salary Certificate), the AI *prepares* the request and presents a `[Submit request]` confirmation button for the human employee to execute.
- Tool invocation must pass through the existing `PermissionService` and `Global AI Kill Switch`.

### 3. Context & Domain Assistants
- **Leave Assistant**: Inspects balance/calendar and prepares a leave request.
- **Career/Learning Assistant**: Inspects Digital Twin and target role to summarize readiness and recommend courses.
- **Performance Assistant**: Summarizes goal progress without inventing opaque scores.
- **Document Assistant**: Informs about expiring documents and required policies.

### 4. Privacy, Security, & Governance
- **Tenant & Scope Isolation**: AI can only query the logged-in employee's data. Cross-tenant or cross-employee queries are blocked.
- **Data Exfiltration/Prompt Injection Defense**: Content retrieved from employee input or external documents will not redefine AI instructions. 
- **Proactive AI Settings (`/employee/ai/settings`)**: Employees can disable proactive insights and learning recommendations.
- **Audit**: All tool invocations will be logged for HR observability (`/admin/ai/audits`).

## Testing & QA
- **Security Tests**: Validate that prompt injections or requests for unauthorized data (e.g., another employee's salary) fail.
- **Kill Switch Test**: Verify that engaging the AI Kill Switch gracefully disables the Employee AI chat.
- Produce `PHASE_4G_EMPLOYEE_AI_QA.md` alongside the feature implementation.
