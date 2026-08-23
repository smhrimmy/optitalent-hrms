import { JobRequisition, Candidate, ScreeningMatch } from './types';

export class ExplainableCandidateMatcher {
    
    /**
     * Matches a candidate's extracted skills against a Job Requisition.
     * Provides explicit, line-by-line evidence rather than an opaque score.
     */
    evaluateCandidate(requisition: JobRequisition, candidate: Candidate): ScreeningMatch {
        const evidence: ScreeningMatch['evidence'] = [];
        const gaps: string[] = [];
        let requiredMatched = 0;

        // Evaluate Required Skills
        requisition.requiredSkills.forEach(reqSkill => {
            const found = candidate.extractedSkills.some(
                cSkill => cSkill.toLowerCase() === reqSkill.toLowerCase()
            );
            
            evidence.push({
                skill: reqSkill,
                requirement: 'REQUIRED',
                found: found
                // Note: In a real AI parsing engine, we'd extract years of experience per skill
            });

            if (found) {
                requiredMatched++;
            } else {
                gaps.push(reqSkill);
            }
        });

        // Evaluate Preferred Skills
        requisition.preferredSkills.forEach(prefSkill => {
            const found = candidate.extractedSkills.some(
                cSkill => cSkill.toLowerCase() === prefSkill.toLowerCase()
            );

            if (found) {
                evidence.push({
                    skill: prefSkill,
                    requirement: 'PREFERRED',
                    found: true
                });
            } else {
                gaps.push(`${prefSkill} (Preferred)`);
            }
        });

        // Determine Match Level
        const requiredRatio = requiredMatched / Math.max(1, requisition.requiredSkills.length);
        let matchLevel: 'STRONG' | 'MODERATE' | 'WEAK' = 'WEAK';
        let recommendation = 'Reject';

        if (requiredRatio === 1) {
            matchLevel = 'STRONG';
            recommendation = 'Proceed to technical interview';
        } else if (requiredRatio >= 0.5) {
            matchLevel = 'MODERATE';
            recommendation = 'Proceed to recruiter screen';
        }

        return {
            matchLevel,
            confidence: 'MEDIUM',
            evidence,
            gaps,
            recommendation,
            limitations: ['Resume parsing may not have detected all variants of skill names.']
        };
    }
}

export const candidateMatcher = new ExplainableCandidateMatcher();
