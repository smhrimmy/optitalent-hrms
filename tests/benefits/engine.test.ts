import { describe, it, expect } from 'vitest';
import { eligibilityEngine } from '../../src/lib/benefits/engine';
import { BenefitPlan, EmployeeContext } from '../../src/lib/benefits/types';

describe('Benefits Eligibility Engine', () => {

    it('accurately calculates eligibility and produces a trace', () => {
        const employee: EmployeeContext = {
            employeeId: 'emp-1042', country: 'India', entity: 'OptiTalent', location: 'Bangalore',
            employmentType: 'FULL_TIME', tenureMonths: 14, grade: '5', jobLevel: 5, compensationAmount: 120000
        };

        const execPlan: BenefitPlan = {
            id: 'b-exec', tenantId: 't1', name: 'Executive Health Plan', category: 'HEALTH',
            provider: 'GlobalHealth', employerContributionAmount: 5000, employeeContributionAmount: 0,
            taxTreatment: 'PRE_TAX', status: 'ACTIVE',
            eligibilityRules: [
                { field: 'jobLevel', operator: 'GREATER_THAN_OR_EQUALS', value: 7 }
            ]
        };

        const learningPlan: BenefitPlan = {
            id: 'b-learn', tenantId: 't1', name: 'Learning Allowance', category: 'ALLOWANCE',
            provider: 'Internal', employerContributionAmount: 1000, employeeContributionAmount: 0,
            taxTreatment: 'TAX_EXEMPT', status: 'ACTIVE',
            eligibilityRules: [
                { field: 'employmentType', operator: 'EQUALS', value: 'FULL_TIME' },
                { field: 'tenureMonths', operator: 'GREATER_THAN_OR_EQUALS', value: 6 }
            ]
        };

        const execResult = eligibilityEngine.evaluateEligibility(employee, execPlan);
        expect(execResult.isEligible).toBe(false);
        expect(execResult.steps[0].passed).toBe(false);

        const learnResult = eligibilityEngine.evaluateEligibility(employee, learningPlan);
        expect(learnResult.isEligible).toBe(true);
        expect(learnResult.steps[0].passed).toBe(true);
        expect(learnResult.steps[1].passed).toBe(true);
    });
});
