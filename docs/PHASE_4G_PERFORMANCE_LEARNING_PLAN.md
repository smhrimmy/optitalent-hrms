# Phase 4G.3: Performance & Learning OS Implementation Plan

## Goal
Connect the Performance Engine, Digital Twin, Skills Engine, and Learning Engine into a unified Employee Experience OS. 
Instead of isolated modules, the employee will see a continuous loop:
`Performance (Goals/Feedback) -> Verified Evidence -> Digital Twin Skills -> Role Readiness -> Recommended Learning`.

## Existing Infrastructure Audit
- **Models to extend/reuse**: `EmployeeContextService`, `EmployeeActionItem`, `EmployeeRequest`.
- **Components to reuse**: `<ActionCenter />`, `<RequestTimeline />`, `<EditableField />`, `<ProfileCompleteness />`, `<SkillGapMap />`, `<AIInsightCard />`.
- **Underlying Engines**: Performance Engine, Learning Engine, Skills Engine, Digital Twin, Event Registry.

## UI Implementation

### 1. Performance OS (`/employee/performance`)
- **Dashboard**: High-level overview of review cycle, goal progress, and milestones.
- **Goal Cards**: Status-colored cards (Not Started, On Track, At Risk, Completed) with semantic tokens.
- **Goal Detail (`/employee/performance/goals/[id]`)**: Deep dive into progress, milestones, and evidence. 
  - **CRITICAL UX**: Distinguish between *Self-reported* evidence and *Verified* evidence. Only verified evidence feeds the Digital Twin.
- **Feedback & Review**: 
  - Employee-safe views for Manager, Peer, and Recognition feedback.
  - Guided self-review flow with autosave states.
  - Integration with `Workflow Runtime` for review state transitions (Draft -> Self Review -> Manager Review).

### 2. Learning OS (`/employee/learning`)
- **Dashboard**: Track completed courses, required training, and overall career readiness.
- **Course Detail (`/employee/learning/courses/[id]`)**: Overview, objectives, lessons, and assessments.
- **Assessment Flow**: Strict state machine (Loading, Submitting, Passed, Failed). Prevents duplicate submissions.
- **Learning loop**: 
  1. Assessment Passed.
  2. `skill.evidence_added` event emitted to `EventRegistry`.
  3. Digital Twin updates Skill Graph.
  4. Role Readiness recalculates.

### 3. Required Training (`/employee/learning/required`)
- Connects to Policy Engine to explain *why* training is required (e.g., Compliance, Location).

### 4. Certificates & History
- Dedicated routes for `/employee/learning/history` and `/employee/learning/certificates` with expiry tracking.

## AI Integration & Governance
- **Performance AI**: Summarizes achievements and evidence via `<AIInsightCard />`. Will NOT generate opaque "Performance Scores".
- **Learning AI**: Explains *why* courses are recommended based on Digital Twin skill gaps.
- **Governance**: All AI queries go through the `ToolExecutionPipeline` and respect the Global AI Kill Switch.

## Security & Permissions
- Strict RBAC enforcement. Employees can update *permitted* goal progress but cannot edit finalized reviews or manager-owned ratings.
- Data fetching must use tenant-aware and identity-aware boundaries.

## Testing & QA
- Verify mobile responsiveness (bottom navigation integration).
- Test state persistence (refreshing does not lose data).
- Ensure semantic accessibility (WCAG 2.2 AA).
- Negative authorization tests: Attempting to modify restricted fields must throw exceptions.
