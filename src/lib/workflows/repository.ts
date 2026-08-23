import { Workflow, WorkflowVersion, WorkflowExecution, WorkflowExecutionLog } from './types';

// Mock in-memory repository for demonstration (would be replaced by Supabase / unified data layer)

class InMemoryWorkflowRepository {
  private workflows: Map<string, Workflow> = new Map();
  private versions: Map<string, WorkflowVersion[]> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private logs: Map<string, WorkflowExecutionLog[]> = new Map();

  async getWorkflow(id: string): Promise<Workflow | undefined> {
    return this.workflows.get(id);
  }

  async saveWorkflow(workflow: Workflow): Promise<void> {
    this.workflows.set(workflow.id, workflow);
  }

  async getActiveVersion(workflowId: string): Promise<WorkflowVersion | undefined> {
    const versions = this.versions.get(workflowId) || [];
    return versions.find(v => v.isActive);
  }

  async saveVersion(version: WorkflowVersion): Promise<void> {
    const existing = this.versions.get(version.workflowId) || [];
    this.versions.set(version.workflowId, [...existing, version]);
  }

  async createExecution(execution: WorkflowExecution): Promise<void> {
    this.executions.set(execution.id, execution);
  }

  async getExecution(id: string): Promise<WorkflowExecution | undefined> {
    return this.executions.get(id);
  }

  async updateExecution(execution: WorkflowExecution): Promise<void> {
    this.executions.set(execution.id, execution);
  }

  async logExecutionStep(log: WorkflowExecutionLog): Promise<void> {
    const existing = this.logs.get(log.executionId) || [];
    this.logs.set(log.executionId, [...existing, log]);
  }

  async getExecutionLogs(executionId: string): Promise<WorkflowExecutionLog[]> {
    return this.logs.get(executionId) || [];
  }
}

export const workflowRepository = new InMemoryWorkflowRepository();
