import { Course, RecommendationExplanation, RoleReadiness } from './types';

export class LearningAssistant {
    
    /**
     * Generates an explainable recommendation based on calculated skill gaps.
     */
    recommendCoursesForGaps(
        roleReadiness: RoleReadiness, 
        availableCourses: Course[]
    ): RecommendationExplanation[] {
        
        const recommendations: RecommendationExplanation[] = [];

        for (const gap of roleReadiness.skillGaps) {
            if (gap.gap > 0) {
                // Find courses that target this skill and offer enough proficiency to close the gap
                const matchedCourse = availableCourses.find(c => 
                    c.skillsTargeted.some(st => st.skill === gap.skill && st.targetProficiency >= gap.required)
                );

                if (matchedCourse) {
                    recommendations.push({
                        courseId: matchedCourse.id,
                        reason: `Your target role (${roleReadiness.targetRole}) requires ${gap.skill}.`,
                        evidence: `Current verified proficiency: ${gap.current}. Required: ${gap.required}. Gap: ${gap.gap}.`,
                        confidence: 'High',
                        limitations: 'Proficiency increase is an estimate; actual increase requires passing the final assessment.'
                    });
                }
            }
        }

        return recommendations;
    }
}

export const learningAssistant = new LearningAssistant();
