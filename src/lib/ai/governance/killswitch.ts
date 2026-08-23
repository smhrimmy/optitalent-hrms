import { ObservabilityLogger } from '../../observability/logger';
import { AIGovernanceRegistry } from './registry';

export class GlobalAIKillSwitch {
    private static isGlobalAIEnabled: boolean = true;
    private static disabledAgents: Set<string> = new Set();
    private static disabledTools: Set<string> = new Set();

    /**
     * Checks if AI Execution is permitted. Throws an error if blocked.
     */
    static enforce(companyId: string, agentId?: string, toolId?: string) {
        if (!this.isGlobalAIEnabled) {
            AIGovernanceRegistry.logIncident(companyId, agentId || 'UNKNOWN', 'CRITICAL', 'Execution blocked by Global AI Kill Switch.', true);
            throw new Error('AI Execution is currently disabled globally by administrators.');
        }

        if (agentId && this.disabledAgents.has(agentId)) {
            AIGovernanceRegistry.logIncident(companyId, agentId, 'HIGH', `Execution of suspended agent ${agentId} blocked.`, true);
            throw new Error(`AI Agent ${agentId} is currently suspended.`);
        }

        if (toolId && this.disabledTools.has(toolId)) {
            AIGovernanceRegistry.logIncident(companyId, agentId || 'UNKNOWN', 'HIGH', `Execution of suspended tool ${toolId} blocked.`, true);
            throw new Error(`AI Tool ${toolId} is currently suspended.`);
        }
    }

    // --- Control Plane ---

    static engageGlobalKillSwitch(adminUserId: string) {
        this.isGlobalAIEnabled = false;
        ObservabilityLogger.log('CRITICAL', 'SECURITY', `Global AI Kill Switch ENGAGED by ${adminUserId}`);
    }

    static disengageGlobalKillSwitch(adminUserId: string) {
        this.isGlobalAIEnabled = true;
        ObservabilityLogger.log('WARN', 'SECURITY', `Global AI Kill Switch DISENGAGED by ${adminUserId}`);
    }

    static getStatus() {
        return {
            globalEnabled: this.isGlobalAIEnabled,
            disabledAgents: Array.from(this.disabledAgents),
            disabledTools: Array.from(this.disabledTools)
        };
    }
}
