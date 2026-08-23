# OptiTalent Policy Engine

The Policy Engine calculates the *effective policy* dynamically based on employee attributes, enabling organizations to manage complex rulesets without duplicating configuration across employee records.

## Architecture

1. **Domain Models**: Defined in `src/lib/policies/types.ts`.
2. **Evaluator (`evaluator.ts`)**: Calculates the winning policy by traversing available policies, checking conditions, and resolving precedence scopes.
3. **Simulator (`simulator.ts`)**: A read-only utility that allows administrators to simulate outcomes and understand "Why does this employee have this policy?"

## Scope Precedence

Policies are evaluated from least specific to most specific. If multiple policies apply to the same resource (e.g. `leave`), the engine respects the following precedence:

1. `GLOBAL`
2. `TENANT`
3. `LEGAL_ENTITY`
4. `COUNTRY`
5. `STATE`
6. `LOCATION`
7. `DEPARTMENT`
8. `JOB_FAMILY`
9. `EMPLOYMENT_TYPE`
10. `EMPLOYEE`

If two policies share the same scope, the explicitly defined numerical `priority` breaks the tie.

## Rules Evaluation

Once a policy wins, its internal rules are evaluated top-to-bottom using the same safe AST evaluator (`conditionEvaluator.ts`) as the Workflow Engine. The first matching rule returns the final configuration result (e.g., `{ days: 18, rollover: false }`).

## Transparency

The engine explicitly tracks and returns overridden policies in its result (`overriddenPolicies`), ensuring full explainability during audits or UI rendering.
