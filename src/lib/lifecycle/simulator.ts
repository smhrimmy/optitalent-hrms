import { ImpactPreview } from './types';

export class LifecycleSimulator {

    /**
     * Simulates the downstream impact of a lifecycle transition across HR domains.
     * In a real application, this would query the Policy, Benefits, and Payroll engines.
     */
    previewImpact(
        employeeId: string, 
        transitionType: string, 
        targetGrade: number, 
        effectiveDate: string
    ): ImpactPreview {
        
        const impacts: ImpactPreview['impacts'] = [];
        let payrollDelta = 0;

        if (transitionType === 'PROMOTION') {
            impacts.push({
                module: 'COMPENSATION',
                changeSummary: 'Eligible for new salary band associated with Grade ' + targetGrade,
                type: 'POSITIVE'
            });

            if (targetGrade >= 7) {
                impacts.push({
                    module: 'BENEFITS',
                    changeSummary: 'Newly eligible for Executive Health Plan',
                    type: 'POSITIVE'
                });
                payrollDelta += 5000; // Simulated employer contribution increase
            }
            
            impacts.push({
                module: 'LEARNING',
                changeSummary: 'Leadership curriculum recommended based on new role target',
                type: 'NEUTRAL'
            });
            
            impacts.push({
                module: 'ATTENDANCE',
                changeSummary: 'No change to attendance policy or schedule',
                type: 'NEUTRAL'
            });
        }

        return {
            transitionType,
            employeeId,
            effectiveDate,
            impacts,
            estimatedMonthlyPayrollImpact: payrollDelta
        };
    }
}

export const lifecycleSimulator = new LifecycleSimulator();
