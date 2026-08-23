import { describe, it, expect } from 'vitest';
import { skillsEngine } from '../../src/lib/learning/engine';
import { SkillRequirement } from '../../src/lib/learning/types';

describe('Learning & Skills Engine', () => {

    it('accurately calculates skill gaps and role readiness without inflating proficiency', () => {
        const requiredSkills: SkillRequirement[] = [
            { skill: 'Docker', targetProficiency: 80 },
            { skill: 'Kubernetes', targetProficiency: 75 }
        ];

        const currentProficiencies = {
            'Docker': 40,
            'Kubernetes': 0
        };

        const result = skillsEngine.calculateRoleReadiness('emp-1', 'DevOps', requiredSkills, currentProficiencies);

        expect(result.skillGaps).toHaveLength(2);
        
        const dockerGap = result.skillGaps.find(g => g.skill === 'Docker');
        expect(dockerGap?.gap).toBe(40); // 80 - 40

        const k8sGap = result.skillGaps.find(g => g.skill === 'Kubernetes');
        expect(k8sGap?.gap).toBe(75); // 75 - 0

        // Total required = 155. Total capped current = 40. 40/155 = ~26%
        expect(result.readinessPercent).toBe(26);
    });
});
