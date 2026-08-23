import { policyEvaluator } from './evaluator';
import { Policy, PolicyContext, PolicyEvaluationResult } from './types';

export class PolicySimulator {

    /**
     * Simulates evaluating a policy for a specific employee and date, without affecting any real state.
     * Useful for admin transparency ("Why does this employee have this policy?").
     */
    simulate(resource: string, allPolicies: Policy[], employeeContext: Record<string, any>, targetDate: string): PolicyEvaluationResult {
        const context: PolicyContext = {
            companyId: employeeContext.companyId || 'default-company',
            employee: employeeContext,
            date: targetDate
        };

        return policyEvaluator.evaluate(resource, allPolicies, context);
    }
}

export const policySimulator = new PolicySimulator();
