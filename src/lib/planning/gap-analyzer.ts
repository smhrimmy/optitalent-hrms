import { DemandForecast, GapAnalysis } from './types';

// Mock dependencies
// import { DigitalTwinService } from '../digital-twin/service';
// import { CapacityEngine } from '../capacity/engine';
// import { SkillsEngine } from '../skills/engine';

export class GapAnalyzer {
    /**
     * Analyzes a demand forecast against the current state (Digital Twin / Capacity Engine)
     */
    static async analyzeGap(companyId: string, forecast: DemandForecast): Promise<GapAnalysis> {
        
        // MOCK: Fetch current headcount for the target department
        const currentHeadcount = 120; // e.g. DigitalTwinService.getHeadcount(companyId, forecast.department);
        const targetHeadcount = forecast.targetHeadcount;
        const headcountGap = targetHeadcount - currentHeadcount;
        
        // MOCK: Role gaps
        const roleGaps = forecast.requiredRoles.map(roleReq => {
            const current = Math.floor(roleReq.count * 0.6); // Mock: we have 60% of what we need
            return {
                roleId: roleReq.roleId,
                current,
                required: roleReq.count,
                gap: Math.max(0, roleReq.count - current)
            };
        });

        // MOCK: Skill gaps
        const skillGaps = forecast.requiredSkills.map(skillReq => {
            const current = Math.floor(skillReq.count * 0.5); // Mock
            return {
                skillId: skillReq.skillId,
                current,
                required: skillReq.count,
                gap: Math.max(0, skillReq.count - current)
            };
        });

        // MOCK: Find internal candidates
        const internalMobilityCandidates = [
            { employeeId: 'EMP-1042', roleId: forecast.requiredRoles[0]?.roleId || 'ROLE-1', skillMatchScore: 85 },
            { employeeId: 'EMP-2918', roleId: forecast.requiredRoles[0]?.roleId || 'ROLE-1', skillMatchScore: 72 }
        ];

        return {
            id: `gap_${Date.now()}`,
            forecastId: forecast.id,
            timestamp: new Date(),
            headcountGap,
            roleGaps,
            skillGaps,
            internalMobilityCandidates
        };
    }
}
