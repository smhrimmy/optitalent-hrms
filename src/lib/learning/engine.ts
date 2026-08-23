import { RoleReadiness, SkillRequirement } from './types';

export class SkillsEngine {
    
    /**
     * Calculates the skill gap between a target role's requirements and an employee's verified proficiencies.
     */
    calculateRoleReadiness(
        employeeId: string, 
        targetRole: string, 
        requiredSkills: SkillRequirement[], 
        currentProficiencies: Record<string, number>
    ): RoleReadiness {
        
        const skillGaps: RoleReadiness['skillGaps'] = [];
        let totalRequired = 0;
        let totalCurrent = 0;

        for (const req of requiredSkills) {
            const current = currentProficiencies[req.skill] || 0;
            const gap = Math.max(0, req.targetProficiency - current);
            
            skillGaps.push({
                skill: req.skill,
                required: req.targetProficiency,
                current: current,
                gap: gap
            });

            totalRequired += req.targetProficiency;
            totalCurrent += Math.min(current, req.targetProficiency); // Cap current at required for readiness %
        }

        const readinessPercent = totalRequired > 0 ? Math.round((totalCurrent / totalRequired) * 100) : 100;

        return {
            employeeId,
            targetRole,
            readinessPercent,
            skillGaps
        };
    }
}

export const skillsEngine = new SkillsEngine();
