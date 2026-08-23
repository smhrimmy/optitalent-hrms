// Workflow Domain Models

export type WorkflowState = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
export type ExecutionState = 'PENDING' | 'RUNNING' | 'WAITING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'TIMED_OUT';

export interface Workflow {
  id: string;
  companyId: string;
  name: string;
  description: string;
  state: WorkflowState;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowVersion {
  id: string;
  workflowId: string;
  versionNumber: number;
  triggerId: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isActive: boolean;
  createdAt: string;
}

export type NodeType = 'trigger' | 'condition' | 'action' | 'approval' | 'delay' | 'notification' | 'termination';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  config: Record<string, any>;
}

export interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  conditionId?: string; // Optional AST reference
}

export interface WorkflowTrigger {
  id: string;
  eventType: string; // e.g. 'leave.submitted', 'employee.created'
  filters?: Record<string, any>;
}

export interface WorkflowExecution {
  id: string;
  companyId: string;
  workflowId: string;
  versionId: string;
  initiatingUserId: string;
  status: ExecutionState;
  context: Record<string, any>;
  currentNodeId: string | null;
  startedAt: string;
  completedAt?: string;
}

export interface WorkflowExecutionLog {
  id: string;
  executionId: string;
  nodeId: string;
  status: 'SUCCESS' | 'FAILED' | 'WAITING';
  message?: string;
  timestamp: string;
}
