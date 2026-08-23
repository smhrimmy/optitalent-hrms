import { Scenario, CostSimulation, ScenarioComparison } from './types';

// Mock Dependencies
// import { PayrollService } from '../payroll/service';
// import { RecruitmentService } from '../recruitment/service';
// import { LearningService } from '../learning/service';

export class WorkforceSimulator {
    
    /**
     * Simulates the cost and time-to-readiness for a given scenario.
     */
    static async simulateScenario(companyId: string, scenario: Scenario): Promise<CostSimulation> {
        let totalRecruitmentCost = 0;
        let totalLearningCost = 0;
        let totalPayrollIncrease = 0;
        let totalTimeToReadinessDays = 0;
        let totalInterventions = 0;
        
        const assumptions: string[] = [];

        // Mock simulation logic
        for (const intervention of scenario.interventions) {
            totalInterventions += intervention.count;
            
            if (intervention.type === 'HIRE') {
                const costPerHire = intervention.estimatedCostPerUnit || 15000; // Mock recruitment cost
                totalRecruitmentCost += costPerHire * intervention.count;
                
                const avgSalary = 120000; // Mock salary from PayrollService
                totalPayrollIncrease += avgSalary * intervention.count;
                
                const timeToHire = intervention.estimatedTimeToReadinessDays || 90;
                totalTimeToReadinessDays += timeToHire * intervention.count;
                
                assumptions.push(`Hiring ${intervention.count} externals at avg $${costPerHire} cost and 90 days TTH.`);
            } 
            else if (intervention.type === 'DEVELOP' || intervention.type === 'REDEPLOY') {
                const costPerLearning = intervention.estimatedCostPerUnit || 2500; // Mock upskilling cost
                totalLearningCost += costPerLearning * intervention.count;
                
                const timeToLearn = intervention.estimatedTimeToReadinessDays || 45;
                totalTimeToReadinessDays += timeToLearn * intervention.count;
                
                assumptions.push(`Reskilling ${intervention.count} internals at avg $${costPerLearning} cost and 45 days TTR.`);
            }
        }

        const totalProjectedCost = totalRecruitmentCost + totalLearningCost + totalPayrollIncrease;
        const timeToReadinessAvgDays = totalInterventions > 0 ? Math.round(totalTimeToReadinessDays / totalInterventions) : 0;
        
        // Lower risk (higher confidence) for internal mobility
        const percentInternal = scenario.interventions.filter(i => i.type !== 'HIRE').reduce((acc, i) => acc + i.count, 0) / (totalInterventions || 1);
        const confidenceScore = Math.min(95, Math.max(50, 60 + (percentInternal * 30)));

        return {
            scenarioId: scenario.id,
            totalRecruitmentCost,
            totalLearningCost,
            totalPayrollIncrease,
            totalProjectedCost,
            timeToReadinessAvgDays,
            confidenceScore: Math.round(confidenceScore),
            assumptions
        };
    }

    /**
     * Compare multiple scenarios to provide decision support
     */
    static async compareScenarios(companyId: string, forecastId: string, scenarios: Scenario[]): Promise<ScenarioComparison> {
        const comparisons = [];
        
        for (const scenario of scenarios) {
            const simulation = await this.simulateScenario(companyId, scenario);
            comparisons.push({ scenario, simulation });
        }

        // Simple mock recommendation engine: Pick the one with highest confidence
        let recommendedScenarioId: string | undefined;
        let highestConfidence = 0;
        
        for (const comp of comparisons) {
            if (comp.simulation.confidenceScore > highestConfidence) {
                highestConfidence = comp.simulation.confidenceScore;
                recommendedScenarioId = comp.scenario.id;
            }
        }

        return {
            forecastId,
            scenarios: comparisons,
            recommendedScenarioId
        };
    }
}
