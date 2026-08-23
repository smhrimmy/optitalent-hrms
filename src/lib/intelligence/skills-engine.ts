import { EmployeeProfile } from './models';

export interface TargetRole {
    title: string;
    requiredSkills: string[];
}

export interface SkillGapAnalysis {
    employeeId: string;
    targetRole: string;
    matchedSkills: string[];
    missingSkills: string[];
    gapPercentage: number;
}

export class SkillsEngine {
    
    /**
     * Calculates the skill gap for an employee against a target role.
     */
    calculateGap(employee: EmployeeProfile, targetRole: TargetRole): SkillGapAnalysis {
        const employeeSkills = new Set(employee.skills.map(s => s.name.toLowerCase()));
        const matched = [];
        const missing = [];

        for (const reqSkill of targetRole.requiredSkills) {
            if (employeeSkills.has(reqSkill.toLowerCase())) {
                matched.push(reqSkill);
            } else {
                missing.push(reqSkill);
            }
        }

        const total = targetRole.requiredSkills.length;
        const gapPercentage = total === 0 ? 0 : Math.round((missing.length / total) * 100);

        return {
            employeeId: employee.id,
            targetRole: targetRole.title,
            matchedSkills: matched,
            missingSkills: missing,
            gapPercentage
        };
    }
}

export const skillsEngine = new SkillsEngine();
