import { BenefitPlan, EligibilityTrace, EmployeeContext } from './types';

export class EligibilityEngine {
    
    evaluateEligibility(employee: EmployeeContext, plan: BenefitPlan): EligibilityTrace {
        const trace: EligibilityTrace = {
            benefitId: plan.id,
            isEligible: true, // Optimistically true until a rule fails
            steps: []
        };

        if (plan.eligibilityRules.length === 0) {
            return trace;
        }

        for (const rule of plan.eligibilityRules) {
            const employeeValue = employee[rule.field];
            let passed = false;

            switch (rule.operator) {
                case 'EQUALS':
                    passed = employeeValue === rule.value;
                    break;
                case 'NOT_EQUALS':
                    passed = employeeValue !== rule.value;
                    break;
                case 'IN':
                    passed = Array.isArray(rule.value) && rule.value.includes(employeeValue);
                    break;
                case 'GREATER_THAN':
                    passed = typeof employeeValue === 'number' && employeeValue > rule.value;
                    break;
                case 'GREATER_THAN_OR_EQUALS':
                    passed = typeof employeeValue === 'number' && employeeValue >= rule.value;
                    break;
                // Add more as needed
            }

            trace.steps.push({
                field: rule.field,
                ruleDescription: `${rule.field} ${rule.operator} ${rule.value}`,
                employeeValue,
                passed
            });

            if (!passed) {
                trace.isEligible = false;
            }
        }

        return trace;
    }
}

export const eligibilityEngine = new EligibilityEngine();
