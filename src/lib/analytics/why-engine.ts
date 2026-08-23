export interface DiagnosticInsight {
    metricId: string;
    currentValue: number;
    previousValue: number;
    deltaPercentage: number;
    
    topContributors: { segmentName: string; pointContribution: number }[];
    correlatedSignals: string[];
    
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class AnalyticsWhyEngine {
    
    /**
     * Analyzes what drove a metric change and returns an explainable insight.
     */
    static async explainChange(tenantId: string, metricId: string): Promise<DiagnosticInsight> {
        // Mock Implementation of "Why?" Engine
        
        if (metricId === 'attrition_rate') {
            return {
                metricId: 'attrition_rate',
                currentValue: 8.7,
                previousValue: 6.9,
                deltaPercentage: 26.1, // relative increase
                
                topContributors: [
                    { segmentName: 'Department: Engineering', pointContribution: +2.1 },
                    { segmentName: 'Location: Bangalore', pointContribution: +1.2 },
                    { segmentName: 'Department: Support', pointContribution: +0.8 }
                ],
                
                correlatedSignals: [
                    'Increased workload (Overtime hours up 18% in Eng)',
                    'Compensation compression vs market benchmark',
                    'Recent re-org (Manager changes)'
                ],
                
                confidence: 'MEDIUM'
            };
        }

        // Generic fallback
        return {
            metricId,
            currentValue: 100,
            previousValue: 100,
            deltaPercentage: 0,
            topContributors: [],
            correlatedSignals: [],
            confidence: 'LOW'
        };
    }
}
