import { GlobalEmployeeContext, GlobalEntities } from '../entity';
import { LocalizationEngine } from '../localization/engine';

export interface MobilitySimulationResult {
    sourceCountry: string;
    targetCountry: string;
    impacts: {
        category: 'PAYROLL' | 'BENEFITS' | 'LEAVE' | 'COMPLIANCE';
        description: string;
        severity: 'LOW' | 'MEDIUM' | 'HIGH';
    }[];
    requiredWorkflows: string[];
}

export class MobilitySimulator {
    
    /**
     * Simulates the HR impact of moving an employee from one legal entity/country to another.
     */
    static simulateTransfer(
        employeeContext: GlobalEmployeeContext,
        targetEntityId: string
    ): MobilitySimulationResult {
        
        const sourceEntity = GlobalEntities[employeeContext.entityId];
        const targetEntity = GlobalEntities[targetEntityId];

        if (!sourceEntity || !targetEntity) {
            throw new Error('Invalid source or target entity.');
        }

        const sourceProvider = LocalizationEngine.getProvider(sourceEntity.country);
        const targetProvider = LocalizationEngine.getProvider(targetEntity.country);

        const impacts: MobilitySimulationResult['impacts'] = [];
        const requiredWorkflows: string[] = ['Initiate Global Transfer Request'];

        // 1. Currency Impact
        if (sourceEntity.baseCurrency !== targetEntity.baseCurrency) {
            impacts.push({
                category: 'PAYROLL',
                description: `Salary will be converted from ${sourceEntity.baseCurrency} to ${targetEntity.baseCurrency}. FX rates must be locked.`,
                severity: 'HIGH'
            });
        }

        // 2. Leave Entitlement Differences
        const sourceLeave = sourceProvider.getStatutoryLeaveEntitlements(employeeContext);
        const targetLeave = targetProvider.getStatutoryLeaveEntitlements(employeeContext);
        
        const sourceAnnual = sourceLeave.find(l => l.type === 'ANNUAL')?.daysPerYear || 0;
        const targetAnnual = targetLeave.find(l => l.type === 'ANNUAL')?.daysPerYear || 0;

        if (sourceAnnual !== targetAnnual) {
            impacts.push({
                category: 'LEAVE',
                description: `Statutory Annual Leave changes from ${sourceAnnual} to ${targetAnnual} days. PTO payout may be required in ${sourceEntity.country}.`,
                severity: 'MEDIUM'
            });
            if (sourceAnnual > targetAnnual) {
                requiredWorkflows.push('Draft localized PTO retention agreement (Optional)');
            }
        }

        // 3. Compliance & Visas
        if (sourceEntity.country !== targetEntity.country) {
            impacts.push({
                category: 'COMPLIANCE',
                description: `Work authorization required for ${targetEntity.country}. Check visa status.`,
                severity: 'HIGH'
            });
            requiredWorkflows.push(`Initiate Visa Check for ${targetEntity.country}`);
        }

        return {
            sourceCountry: sourceProvider.name,
            targetCountry: targetProvider.name,
            impacts,
            requiredWorkflows
        };
    }
}
