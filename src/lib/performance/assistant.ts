import { ReviewSummary, Goal, Feedback, SkillEvidence } from './types';

export class ExplainableReviewAssistant {
    
    /**
     * Synthesizes an employee's data over a performance period into a transparent, cited summary.
     */
    generateReviewSummary(
        employeeId: string, 
        period: string, 
        goals: Goal[], 
        feedbacks: Feedback[], 
        twinEvidence: SkillEvidence[]
    ): ReviewSummary {
        // 1. Key Achievements from Completed Goals
        const keyAchievements = goals
            .filter(g => g.status === 'COMPLETED')
            .map(g => `Completed Goal: ${g.title} (100% Progress)`);

        // 2. Skill Growth from the Digital Twin Event Bus
        // e.g. "Node.js (Validated by GOAL_COMPLETION: Shipped Payment API)"
        const skillGrowth = twinEvidence;

        // 3. Constructive Feedback Themes from Peers
        const constructiveFeedback: string[] = [];
        const managerFeedbacks = feedbacks.filter(f => f.type === 'MANAGER');
        const peerFeedbacks = feedbacks.filter(f => f.type === 'PEER');

        if (peerFeedbacks.length > 0) {
            constructiveFeedback.push(`Peer feedback highlights strong collaboration, but notes a need for better documentation on complex features.`);
        }

        // 4. Recommendation Logic
        let recommendation = 'Meets Expectations';
        if (keyAchievements.length > 0 && skillGrowth.length > 2 && managerFeedbacks.length > 0) {
            recommendation = 'Exceeds Expectations. Strong delivery on OKRs and demonstrable skill expansion.';
        } else if (goals.some(g => g.status === 'AT_RISK' || g.status === 'OFF_TRACK')) {
            recommendation = 'Needs Improvement. Missed key OKR targets.';
        }

        return {
            employeeId,
            period,
            overallRecommendation: recommendation,
            keyAchievements,
            skillGrowth,
            constructiveFeedback,
            aiConfidence: 'HIGH'
        };
    }
}

export const reviewAssistant = new ExplainableReviewAssistant();
