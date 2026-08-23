import { AgentOrchestrator } from '../orchestrator';

export class AgentEventListener {
    
    /**
     * Subscribes to the central Event Bus.
     * When specific operational events occur, it spawns an Agent to analyze and act.
     */
    static async handleDomainEvent(companyId: string, eventType: string, payload: any) {
        
        console.log(`[AI Event Listener] Received event: ${eventType}`);

        // A system context used for background agent tasks.
        // It operates with a predefined set of scopes configured by the admin for that specific agent.
        const backgroundAgentContext = {
            companyId,
            userId: 'SYSTEM_AGENT',
            userScopes: ['analytics.read', 'planning.simulate', 'requests.create'] // Allowed scopes for this agent
        };

        if (eventType === 'capacity.shortage.detected') {
            console.log(`[AI Event Listener] Spawning Workforce Planning Agent...`);
            
            // Generate an automatic prompt based on the event payload
            const prompt = `A capacity shortage was detected in department ${payload.department}. Fetch the current headcount metric and simulate a scenario to resolve it.`;
            
            const result = await AgentOrchestrator.handleRequest(prompt, backgroundAgentContext);
            
            console.log(`[AI Event Listener] Agent execution finished with status: ${result.status}`);
        }
    }
}
