import { describe, it, expect } from 'vitest';
import { skillsEngine, TargetRole } from '../../src/lib/intelligence/skills-engine';
import { whyEngine } from '../../src/lib/intelligence/why-engine';
import { EmployeeProfile } from '../../src/lib/intelligence/models';

describe('Workforce Intelligence Engines', () => {

    it('calculates skill gap accurately', () => {
        const emp: EmployeeProfile = {
            id: 'emp-1',
            name: 'Bob',
            departmentId: 'eng',
            jobRole: 'Junior Dev',
            skills: [
                { id: 's1', name: 'React', category: 'Frontend', verifiedProficiency: 'Intermediate', evidence: [] },
                { id: 's2', name: 'TypeScript', category: 'Language', verifiedProficiency: 'Advanced', evidence: [] }
            ],
            activeProjects: [],
            leaveBalanceDays: 20,
            projectAllocationPercentage: 100
        };

        const targetRole: TargetRole = {
            title: 'Senior Frontend Developer',
            requiredSkills: ['React', 'TypeScript', 'System Design', 'Leadership']
        };

        const result = skillsEngine.calculateGap(emp, targetRole);

        expect(result.matchedSkills).toContain('React');
        expect(result.missingSkills).toContain('Leadership');
        expect(result.missingSkills).toContain('System Design');
        expect(result.gapPercentage).toBe(50); // 2 missing out of 4
    });

    it('provides explainability for known anomalies', () => {
        const explanation = whyEngine.explainAnomaly('test-tenant', 'overtime_increase', 18);
        
        expect(explanation.confidence).toBe('Medium');
        expect(explanation.signals.length).toBeGreaterThan(0);
        expect(explanation.limitations.length).toBeGreaterThan(0);
    });
});
