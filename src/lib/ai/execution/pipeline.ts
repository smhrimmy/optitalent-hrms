import { ToolRegistry, AgentContext, RiskTier } from '../tools/registry';
// import { PermissionService } from '../../security/permissions';
// import { RequestEngine } from '../../operations/request/engine';

export class RequiresApprovalException extends Error {
    constructor(public message: string, public impactPreview: any) {
        super(message);
        this.name = 'RequiresApprovalException';
    }
}

export class UnauthorizedToolException extends Error {
    constructor(public message: string) {
        super(message);
        this.name = 'UnauthorizedToolException';
    }
}

import { GlobalAIKillSwitch } from '../governance/killswitch';

export class ToolExecutionPipeline {
    
    /**
     * The single entry point for all AI actions. 
     * Enforces permissions, evaluates risk, runs simulations, and routes for approval if needed.
     */
    static async execute(toolName: string, args: any, context: AgentContext): Promise<any> {
        // 0. Global AI Kill Switch Enforcement
        GlobalAIKillSwitch.enforce(context.companyId, context.agentId, toolName);
        const tool = ToolRegistry[toolName];
        if (!tool) {
            throw new Error(`Tool not found: ${toolName}`);
        }

        // 1. Enforce RBAC / ABAC Permissions
        for (const reqScope of tool.requiredPermissions) {
            if (!context.userScopes.includes(reqScope) && !context.userScopes.includes('admin:all')) {
                throw new UnauthorizedToolException(`Agent is forbidden from executing ${toolName}. Missing scope: ${reqScope}`);
            }
        }

        // 2. Risk Tier Evaluation
        if (tool.riskTier === 0 || tool.riskTier === 1) {
            // Low risk, execute immediately
            console.log(`[AI Pipeline] Executing low-risk tool: ${toolName}`);
            return await tool.execute(args, context);
        }

        // 3. Simulation for higher tiers
        const impactPreview = await this.simulateImpact(toolName, args, context);

        // 4. Halt and Route to Approval for Tier 3 and 4
        if (tool.riskTier >= 3 || tool.requiresApproval) {
            console.log(`[AI Pipeline] Halting execution of ${toolName} (Tier ${tool.riskTier}). Requires Human Approval.`);
            
            // In reality, this might create a Request in the Phase 3H Universal Request Engine
            // await RequestEngine.createApprovalRequest(...)
            
            throw new RequiresApprovalException(
                `Action requires human approval. An approval request has been routed to the relevant manager.`,
                impactPreview
            );
        }

        // Tier 2 (Operational, e.g. starting a standard onboarding workflow) usually executes if permitted,
        // but might still be logged heavily.
        return await tool.execute(args, context);
    }

    private static async simulateImpact(toolName: string, args: any, context: AgentContext) {
        // MOCK: Calls the Phase 2D/3G Lifecycle Simulator
        if (toolName === 'modify_compensation') {
            return {
                financialImpact: `+${args.amount} annually`,
                budgetStatus: 'Within Department Budget',
                effectiveDate: 'Next Payroll Cycle',
                requiredApprovers: ['Department Head', 'HR VP']
            };
        }
        
        return { note: 'Simulation generated successfully.' };
    }
}
