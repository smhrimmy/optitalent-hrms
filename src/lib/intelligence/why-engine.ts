import { getDigitalTwin } from './projections';

export interface ExplanationResult {
    metric: string;
    value: number;
    period: string;
    signals: string[];
    evidence: string[];
    confidence: 'High' | 'Medium' | 'Low';
    limitations: string[];
}

export class WhyEngine {
    
    /**
     * Attempts to explain an anomalous metric by correlating it with signals from the Digital Twin.
     * Note: This infers association, not definitive causality.
     */
    explainAnomaly(tenantId: string, metricName: string, metricValue: number): ExplanationResult {
        const twin = getDigitalTwin(tenantId);

        // Simulated Logic for 'overtime_spike'
        if (metricName === 'overtime_increase') {
            return {
                metric: 'overtime_increase',
                value: metricValue,
                period: new Date().toISOString().substring(0, 7),
                signals: [
                    'Night shift allocation increased by 12%',
                    'Two critical positions in Manufacturing remain open'
                ],
                evidence: [
                    'Digital Twin: activeHeadcount for Manufacturing is below target',
                    'Attendance projections show spike in unscheduled shifts'
                ],
                confidence: 'Medium',
                limitations: [
                    'Production volume data is not currently connected to the HR graph.'
                ]
            };
        }

        return {
            metric: metricName,
            value: metricValue,
            period: new Date().toISOString().substring(0, 7),
            signals: [],
            evidence: [],
            confidence: 'Low',
            limitations: ['Insufficient data in Digital Twin to explain this metric.']
        };
    }
}

export const whyEngine = new WhyEngine();
