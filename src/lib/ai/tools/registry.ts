export type RiskTier = 
    | 0 // Read-only / Informational
    | 1 // Low-risk action (e.g. creating a basic request)
    | 2 // Operational action (e.g. start onboarding workflow)
    | 3 // Sensitive (e.g. modify compensation)
    | 4; // Highly Sensitive (e.g. terminate employee - NEVER autonomous)

export interface AITool {
    name: string;
    description: string;
    requiredPermissions: string[];
    riskTier: RiskTier;
    requiresApproval: boolean;
    // In a real implementation, this would contain the JSON schema for LLM function calling
    execute: (args: any, context: AgentContext) => Promise<any>;
}

export interface AgentContext {
    companyId: string;
    userId: string;
    userScopes: string[];
}

export const ToolRegistry: Record<string, AITool> = {
    'get_metric': {
        name: 'get_metric',
        description: 'Fetch an aggregate metric from the Semantic Analytics Layer.',
        requiredPermissions: ['analytics.read'],
        riskTier: 0,
        requiresApproval: false,
        execute: async (args, ctx) => {
            return { metric: args.metricId, value: 42, note: 'Mock data from Semantic Layer' };
        }
    },
    'create_request': {
        name: 'create_request',
        description: 'Create an operational request (e.g. IT Helpdesk).',
        requiredPermissions: ['requests.create'],
        riskTier: 1,
        requiresApproval: false,
        execute: async (args, ctx) => {
            return { success: true, requestId: 'REQ-999' };
        }
    },
    'simulate_scenario': {
        name: 'simulate_scenario',
        description: 'Simulates the impact of a workforce planning scenario.',
        requiredPermissions: ['planning.simulate'],
        riskTier: 1,
        requiresApproval: false,
        execute: async (args, ctx) => {
            return { costImpact: '$1M', timeToReady: '90 days' };
        }
    },
    'modify_compensation': {
        name: 'modify_compensation',
        description: 'Changes an employee base salary.',
        requiredPermissions: ['payroll.write'],
        riskTier: 3,
        requiresApproval: true,
        execute: async (args, ctx) => {
            return { success: true, newSalary: args.amount };
        }
    },
    'terminate_employee': {
        name: 'terminate_employee',
        description: 'Initiates employee offboarding and termination.',
        requiredPermissions: ['lifecycle.terminate'],
        riskTier: 4,
        requiresApproval: true, // Always routed to human workflow, never executed by agent directly
        execute: async (args, ctx) => {
            throw new Error('Tier 4 Actions cannot be executed synchronously by AI. Must route to Workflow Runtime.');
        }
    }
};
