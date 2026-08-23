import { BenefitPlan, EligibilityTrace, TotalRewards } from './types';

export class BenefitsAssistant {
    
    /**
     * Translates an eligibility trace into human-readable explanations.
     */
    explainEligibility(trace: EligibilityTrace, plan: BenefitPlan): string[] {
        if (trace.isEligible) {
            return [`You are eligible for ${plan.name}.`];
        }

        const reasons: string[] = [];
        for (const step of trace.steps) {
            if (!step.passed) {
                reasons.push(
                    `You do not meet the requirement for ${step.field}. Required: ${step.ruleDescription}. Your current profile indicates: ${step.employeeValue}.`
                );
            }
        }
        return reasons;
    }

    /**
     * Synthesizes compensation and benefit values into a Total Rewards statement.
     */
    generateTotalRewards(employeeId: string, baseComp: number, activePlans: BenefitPlan[]): TotalRewards {
        let benefitsValue = 0;
        const breakdown = [];

        for (const plan of activePlans) {
            benefitsValue += plan.employerContributionAmount;
            breakdown.push({
                category: plan.name,
                value: plan.employerContributionAmount
            });
        }

        return {
            employeeId,
            baseCompensation: baseComp,
            employerBenefitsValue: benefitsValue,
            totalRewardsValue: baseComp + benefitsValue,
            breakdown
        };
    }
}

export const benefitsAssistant = new BenefitsAssistant();
