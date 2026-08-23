# OptiTalent Workflow Runtime

The Workflow Runtime is the core execution engine for automating HR processes within OptiTalent. It enforces strict RBAC security boundaries, supports dynamic conditional routing, and ensures safe execution of sensitive actions.

## Architecture

The engine is built on the following components:

1. **Domain Models**: Defined in `src/lib/workflows/types.ts`.
2. **State Machine (`engine.ts`)**: The core runner that traverses nodes asynchronously.
3. **AST Evaluator (`evaluator.ts`)**: Safely evaluates conditions (e.g. `leave.duration > 7`) against execution context without executing arbitrary JavaScript.
4. **Idempotency Tracker (`idempotency.ts`)**: Guarantees that actions (like processing payroll) never execute twice for the same execution step, even during retries or network blips.
5. **Action Registry (`actions/registry.ts`)**: A secure list of executable actions. Every action explicitly calls `PermissionService.enforce()` to verify the initiating user has the right to perform the action.
6. **Trigger Engine (`triggers.ts`)**: Listens to system events and starts workflow executions.
7. **Approval Engine (`approvals.ts`)**: Dynamically resolves approvers (like "Manager's Manager") at execution time and handles routing logic (ANY, ALL, SEQUENTIAL).

## Security Perimeter

Workflows **do not** bypass the security authorization layer. 
When a workflow attempts to execute an action (e.g. `employee.update`), the engine reconstructs the original initiating identity context and passes it to the `Action Registry`. The action then invokes the canonical `PermissionService` to ensure compliance. If a workflow attempts an unauthorized action, it fails and halts safely.

## Execution Flow

1. Trigger fired (`leave.submitted`)
2. Engine starts Execution (`PENDING` -> `RUNNING`)
3. Evaluates condition (`leave.duration > 7` -> `TRUE`)
4. Routes to `HR Approval` node.
5. Engine pauses execution (`WAITING`). State is persisted.
6. (Time passes, HR approves)
7. Engine resumes (`RUNNING`)
8. Executes Action (`leave.update_balance`) idempotently.
9. Execution completes (`COMPLETED`).
