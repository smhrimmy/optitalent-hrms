import { describe, it, expect } from 'vitest';
import { candidateMatcher } from '../../src/lib/recruitment/matcher';
import { JobRequisition, Candidate } from '../../src/lib/recruitment/types';

describe('Explainable Candidate Matcher', () => {

    it('returns structured evidence and identifies skill gaps', () => {
        const req: JobRequisition = {
            id: 'req-1', title: 'Backend', department: 'Eng', location: 'Remote',
            type: 'FULL_TIME', status: 'OPEN',
            requiredSkills: ['Node.js', 'PostgreSQL'],
            preferredSkills: ['AWS', 'Docker'],
            minExperienceYears: 5, headcountTarget: 1, headcountFilled: 0
        };

        const candidate: Candidate = {
            id: 'c-1', firstName: 'Test', lastName: 'User', email: 'test@test.com',
            extractedSkills: ['Node.js', 'AWS'], // Missing required PostgreSQL, Missing preferred Docker
            extractedExperienceYears: 6
        };

        const match = candidateMatcher.evaluateCandidate(req, candidate);

        expect(match.matchLevel).toBe('MODERATE');
        expect(match.evidence).toEqual(expect.arrayContaining([
            expect.objectContaining({ skill: 'Node.js', found: true, requirement: 'REQUIRED' }),
            expect.objectContaining({ skill: 'PostgreSQL', found: false, requirement: 'REQUIRED' }),
            expect.objectContaining({ skill: 'AWS', found: true, requirement: 'PREFERRED' })
        ]));
        expect(match.gaps).toContain('PostgreSQL');
        expect(match.gaps).toContain('Docker (Preferred)');
    });
});
