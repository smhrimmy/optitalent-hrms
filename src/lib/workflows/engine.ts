import { WorkflowExecution, WorkflowVersion, WorkflowNode, WorkflowEdge } from './types';
import { workflowRepository } from './repository';
import { conditionEvaluator, ASTNode } from './evaluator';
import { actionRegistry } from './actions/registry';
import { PermissionService } from '../permissions';
import { buildAuthRequest, getServerContext } from '../auth-server';
import { idempotency } from './idempotency';

export class WorkflowEngine {
  
  /**
   * Starts a new workflow execution
   */
  async startExecution(workflowId: string, triggerId: string, initialContext: Record<string, any>): Promise<WorkflowExecution> {
    const version = await workflowRepository.getActiveVersion(workflowId);
    if (!version) throw new Error('No active version found for workflow');

    const authContext = await getServerContext();
    if (!authContext) throw new Error('Unauthorized workflow execution');

    // Security Check: Initiating identity must have workflow.run permission
    const authReq = buildAuthRequest(authContext, 'workflow' as any, 'run', workflowId);
    PermissionService.enforce(authReq);

    const execution: WorkflowExecution = {
      id: crypto.randomUUID(),
      tenantId: authContext.tenantId,
      workflowId,
      versionId: version.id,
      initiatingUserId: authContext.userId,
      status: 'PENDING',
      context: initialContext,
      currentNodeId: this.findInitialNode(version, triggerId)?.id || null,
      startedAt: new Date().toISOString()
    };

    if (!execution.currentNodeId) {
      throw new Error(`Trigger ${triggerId} does not map to any node in version ${version.id}`);
    }

    await workflowRepository.createExecution(execution);
    
    // Asynchronously begin execution
    // In production, this would dispatch to a queue. For now, we simulate async.
    this.processExecution(execution.id).catch(console.error);

    return execution;
  }

  private findInitialNode(version: WorkflowVersion, triggerId: string): WorkflowNode | undefined {
    return version.nodes.find(n => n.type === 'trigger' && n.config.triggerId === triggerId);
  }

  /**
   * Resumes a paused execution (e.g. after approval)
   */
  async resumeExecution(executionId: string, resumeContext: Record<string, any>): Promise<void> {
    const execution = await workflowRepository.getExecution(executionId);
    if (!execution) throw new Error('Execution not found');
    if (execution.status !== 'WAITING') throw new Error(`Cannot resume execution in status ${execution.status}`);

    execution.context = { ...execution.context, ...resumeContext };
    execution.status = 'RUNNING';
    await workflowRepository.updateExecution(execution);

    this.processExecution(execution.id).catch(console.error);
  }

  /**
   * Core state machine runner
   */
  async processExecution(executionId: string): Promise<void> {
    const execution = await workflowRepository.getExecution(executionId);
    if (!execution) return;
    
    if (execution.status === 'PENDING') execution.status = 'RUNNING';

    const version = await workflowRepository.getActiveVersion(execution.workflowId); // Simplified for this prototype
    if (!version) return;

    try {
      while (execution.currentNodeId && execution.status === 'RUNNING') {
        const currentNode = version.nodes.find(n => n.id === execution.currentNodeId);
        if (!currentNode) {
            execution.status = 'FAILED';
            await this.log(executionId, execution.currentNodeId!, 'FAILED', 'Node not found');
            break;
        }

        // Idempotency Check
        const idempKey = idempotency.generateKey(executionId, currentNode.id);
        const locked = await idempotency.acquireLock(idempKey);
        if (!locked) {
            // Already ran, just move on
            execution.currentNodeId = this.getNextNodeId(version, currentNode.id, execution.context);
            continue;
        }

        try {
            await this.evaluateNode(currentNode, execution);
            await this.log(executionId, currentNode.id, 'SUCCESS');
        } catch (err: any) {
            execution.status = 'FAILED';
            await idempotency.releaseLock(idempKey);
            await this.log(executionId, currentNode.id, 'FAILED', err.message);
            break;
        }

        if (execution.status === 'RUNNING') {
           execution.currentNodeId = this.getNextNodeId(version, currentNode.id, execution.context);
           if (!execution.currentNodeId) {
               execution.status = 'COMPLETED';
               execution.completedAt = new Date().toISOString();
           }
        }
        await workflowRepository.updateExecution(execution);
      }
    } catch (globalErr: any) {
        execution.status = 'FAILED';
        await workflowRepository.updateExecution(execution);
    }
  }

  private async evaluateNode(node: WorkflowNode, execution: WorkflowExecution): Promise<void> {
    switch (node.type) {
        case 'action':
            const action = actionRegistry.getAction(node.config.actionId);
            if (!action) throw new Error(`Action ${node.config.actionId} not found`);
            
            // Reconstruct the auth context for the action
            const actionAuthContext = {
                tenantId: execution.tenantId,
                userId: execution.initiatingUserId,
                role: 'system' // or resolve from original user
            };
            
            const resultContext = await action.execute(execution.context, actionAuthContext);
            execution.context = { ...execution.context, ...resultContext };
            break;

        case 'condition':
            // Logic handled in edge traversal, node itself just passes through or sets variables
            break;

        case 'approval':
            // Pauses the workflow
            execution.status = 'WAITING';
            // In a full implementation, this creates an Approval record and sends notifications
            break;
            
        case 'delay':
            execution.status = 'WAITING';
            // Would schedule a wakeup
            break;
            
        case 'trigger':
            // No-op execution wise
            break;

        case 'notification':
        case 'termination':
            if (node.type === 'termination') {
                execution.status = 'COMPLETED';
            }
            break;
    }
  }

  private getNextNodeId(version: WorkflowVersion, currentNodeId: string, context: Record<string, any>): string | null {
      const edges = version.edges.filter(e => e.sourceNodeId === currentNodeId);
      
      for (const edge of edges) {
          if (edge.conditionId) {
              const conditionNode = version.nodes.find(n => n.id === edge.conditionId);
              if (conditionNode && conditionNode.type === 'condition') {
                 const ast = conditionNode.config.ast as ASTNode;
                 if (conditionEvaluator.evaluate(ast, context)) {
                     return edge.targetNodeId;
                 }
              }
          } else {
              // Default unconditional edge
              return edge.targetNodeId;
          }
      }
      return null;
  }

  private async log(executionId: string, nodeId: string, status: 'SUCCESS'|'FAILED'|'WAITING', message?: string) {
      await workflowRepository.logExecutionStep({
          id: crypto.randomUUID(),
          executionId,
          nodeId,
          status,
          message,
          timestamp: new Date().toISOString()
      });
  }
}

export const workflowEngine = new WorkflowEngine();
