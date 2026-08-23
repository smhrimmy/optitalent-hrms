import { RequestType, RequestSubmission, RequestStatus, RequestStatusHistory, RequestComment } from './types';

// Mock DB for the engine
const requestTypesDB = new Map<string, RequestType>();
const submissionsDB = new Map<string, RequestSubmission>();
const historyDB = new Map<string, RequestStatusHistory[]>();
const commentsDB = new Map<string, RequestComment[]>();

export class RequestEngine {
    /**
     * Submit a new request
     */
    static async submitRequest(tenantId: string, employeeId: string, requestTypeId: string, formData: Record<string, any>): Promise<RequestSubmission> {
        // Validate request type exists
        const requestType = requestTypesDB.get(requestTypeId);
        if (!requestType) {
            throw new Error(`RequestType ${requestTypeId} not found`);
        }

        // Validate eligibility (mock check)
        // In reality, this would call PolicyEngine
        
        const submissionId = `req_${Date.now()}`;
        const submission: RequestSubmission = {
            id: submissionId,
            tenantId,
            requestTypeId,
            employeeId,
            status: 'SUBMITTED',
            formData,
            submittedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        submissionsDB.set(submissionId, submission);

        // Record history
        this.recordHistory(submissionId, employeeId, 'DRAFT', 'SUBMITTED', 'Request submitted by employee');

        // Evaluate Workflow / Auto-Approve if no workflow
        if (!requestType.approvalWorkflow || requestType.approvalWorkflow.length === 0) {
            await this.updateStatus(submissionId, 'system', 'APPROVED', 'Auto-approved (no workflow configured)');
        } else {
            submission.currentApprovalStepId = requestType.approvalWorkflow[0].stepId;
            await this.updateStatus(submissionId, 'system', 'PENDING_APPROVAL', 'Routed to initial approver');
        }

        return submission;
    }

    /**
     * Approve or reject a request
     */
    static async reviewRequest(submissionId: string, actorId: string, action: 'APPROVE' | 'REJECT', comment?: string): Promise<RequestSubmission> {
        const submission = submissionsDB.get(submissionId);
        if (!submission) throw new Error('Submission not found');
        
        if (submission.status !== 'PENDING_APPROVAL') {
            throw new Error(`Cannot review request in status ${submission.status}`);
        }

        const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
        await this.updateStatus(submissionId, actorId, newStatus, comment);
        
        if (action === 'APPROVE') {
            // If approved, move to in progress or completed
            await this.updateStatus(submissionId, 'system', 'IN_PROGRESS', 'Approval completed, processing...');
        }

        return submissionsDB.get(submissionId)!;
    }

    /**
     * Complete a request
     */
    static async completeRequest(submissionId: string, actorId: string, comment?: string): Promise<RequestSubmission> {
        await this.updateStatus(submissionId, actorId, 'COMPLETED', comment);
        return submissionsDB.get(submissionId)!;
    }

    /**
     * Internal: Update status and record history
     */
    private static async updateStatus(submissionId: string, actorId: string, newStatus: RequestStatus, comment?: string) {
        const submission = submissionsDB.get(submissionId);
        if (!submission) return;

        const oldStatus = submission.status;
        submission.status = newStatus;
        submission.updatedAt = new Date();
        
        this.recordHistory(submissionId, actorId, oldStatus, newStatus, comment);
    }

    private static recordHistory(submissionId: string, actorId: string, oldStatus: RequestStatus, newStatus: RequestStatus, comment?: string) {
        const historyList = historyDB.get(submissionId) || [];
        historyList.push({
            id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            requestId: submissionId,
            actorId,
            previousStatus: oldStatus,
            newStatus,
            comment,
            timestamp: new Date()
        });
        historyDB.set(submissionId, historyList);
    }
    
    // --- Builder Methods ---
    
    static async registerRequestType(requestType: RequestType): Promise<void> {
        requestTypesDB.set(requestType.id, requestType);
    }
    
    static async getAvailableRequestTypes(tenantId: string, employeeId: string): Promise<RequestType[]> {
        // In a real app, we would filter by PolicyEngine rules
        return Array.from(requestTypesDB.values()).filter(t => t.tenantId === tenantId && t.isActive);
    }
    
    static async getEmployeeSubmissions(tenantId: string, employeeId: string): Promise<RequestSubmission[]> {
        return Array.from(submissionsDB.values()).filter(s => s.tenantId === tenantId && s.employeeId === employeeId);
    }
}
