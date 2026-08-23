import { AgentContext } from './tools/registry';
import { ToolExecutionPipeline, RequiresApprovalException, UnauthorizedToolException } from './execution/pipeline';

export interface AgentActionTrace {
    step: 'OBSERVE' | 'REASON' | 'ACT' | 'HALT_APPROVAL' | 'ERROR';
    description: string;
    data?: any;
    timestamp: Date;
}

export class AgentOrchestrator {
    
    /**
     * The main entry point for conversational or event-driven agent requests.
     */
    static async handleRequest(prompt: string, context: AgentContext) {
        const traces: AgentActionTrace[] = [];
        
        try {
            // OBSERVE: Gather context
            traces.push({ step: 'OBSERVE', description: 'Analyzing request and context', timestamp: new Date() });
            
            // REASON: LLM decides what to do
            traces.push({ step: 'REASON', description: 'LLM generated action plan', timestamp: new Date() });
            
            // MOCK: Simulating the LLM returning a structured tool call based on the prompt
            let toolCalls = this.mockLLMDecision(prompt);
            
            const results = [];
            
            // ACT: Execute the tools securely via the pipeline
            for (const call of toolCalls) {
                traces.push({ step: 'ACT', description: `Attempting to execute tool: ${call.tool}`, data: call.args, timestamp: new Date() });
                
                const result = await ToolExecutionPipeline.execute(call.tool, call.args, context);
                results.push(result);
                
                traces.push({ step: 'ACT', description: `Tool executed successfully: ${call.tool}`, data: result, timestamp: new Date() });
            }
            
            return {
                status: 'COMPLETED',
                response: 'Action completed successfully.',
                traces,
                results
            };

        } catch (error: any) {
            if (error instanceof RequiresApprovalException) {
                traces.push({ step: 'HALT_APPROVAL', description: error.message, data: error.impactPreview, timestamp: new Date() });
                return {
                    status: 'REQUIRES_APPROVAL',
                    response: 'I have prepared this action, but it requires human approval to proceed.',
                    traces
                };
            }
            
            if (error instanceof UnauthorizedToolException) {
                traces.push({ step: 'ERROR', description: error.message, timestamp: new Date() });
                return {
                    status: 'UNAUTHORIZED',
                    response: 'I do not have the required permissions to perform this action on your behalf.',
                    traces
                };
            }

            traces.push({ step: 'ERROR', description: error.message, timestamp: new Date() });
            throw error;
        }
    }

    private static mockLLMDecision(prompt: string) {
        if (prompt.includes('salary') || prompt.includes('compensation')) {
            return [{ tool: 'modify_compensation', args: { employeeId: 'EMP-1', amount: 130000 } }];
        }
        if (prompt.includes('terminate') || prompt.includes('fire')) {
            return [{ tool: 'terminate_employee', args: { employeeId: 'EMP-1' } }];
        }
        if (prompt.includes('metric') || prompt.includes('attrition')) {
            return [{ tool: 'get_metric', args: { metricId: 'attrition_rate' } }];
        }
        return [{ tool: 'get_metric', args: { metricId: 'headcount' } }];
    }
}
