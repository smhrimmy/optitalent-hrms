import { ObservabilityLogger } from '../../observability/logger';

export type AIIncidentLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AIIncident {
    id: string;
    timestamp: Date;
    agentId: string;
    companyId: string;
    level: AIIncidentLevel;
    description: string;
    actionBlocked: boolean;
}

export class AIGovernanceRegistry {
    private static incidents: AIIncident[] = [];
    
    // MOCK Allowed Models
    private static allowedModels = ['gpt-4-turbo', 'claude-3-opus'];

    static logIncident(
        companyId: string, 
        agentId: string, 
        level: AIIncidentLevel, 
        description: string, 
        actionBlocked: boolean
    ) {
        const incident: AIIncident = {
            id: `INC-${Math.floor(Math.random() * 10000)}`,
            timestamp: new Date(),
            agentId,
            companyId,
            level,
            description,
            actionBlocked
        };
        
        this.incidents.unshift(incident);

        ObservabilityLogger.log(
            level === 'CRITICAL' ? 'CRITICAL' : (actionBlocked ? 'WARN' : 'INFO'),
            'AI_AGENT',
            `AI Incident [${level}]: ${description}`,
            { companyId, metadata: { agentId, actionBlocked } }
        );
    }

    static getRecentIncidents(limit: number = 50): AIIncident[] {
        return this.incidents.slice(0, limit);
    }

    static isModelApproved(modelName: string): boolean {
        return this.allowedModels.includes(modelName);
    }
}
