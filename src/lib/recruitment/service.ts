import { JobRequisition, Candidate, ApplicationPipeline, Offer } from './types';
import { eventRegistry } from '../events/registry';
import { PermissionService } from '../permissions';
import { buildAuthRequest } from '../auth-server';
import crypto from 'crypto';

export class RecruitmentService {
    // In-memory mock DB
    private requisitions: Map<string, JobRequisition> = new Map();
    private candidates: Map<string, Candidate> = new Map();
    private pipelines: Map<string, ApplicationPipeline> = new Map();

    async createRequisition(context: any, req: JobRequisition): Promise<JobRequisition> {
        const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');
        this.requisitions.set(req.id, req);
        return req;
    }

    async apply(candidate: Candidate, reqId: string): Promise<ApplicationPipeline> {
        // Public action, no PermissionService enforcement needed for the applicant themselves
        this.candidates.set(candidate.id, candidate);
        const pipeline: ApplicationPipeline = {
            id: `pipe-${crypto.randomUUID()}`,
            requisitionId: reqId,
            candidateId: candidate.id,
            status: 'APPLIED',
            appliedAt: new Date().toISOString(),
            interviews: []
        };
        this.pipelines.set(pipeline.id, pipeline);
        return pipeline;
    }

    async acceptOffer(context: any, pipelineId: string): Promise<void> {
        // Here the Candidate (or Recruiter on their behalf) accepts the offer
        // If Recruiter is doing it, we enforce permissions
        if (context.roles?.includes('Recruiter')) {
            const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');
        }

        const pipeline = this.pipelines.get(pipelineId);
        if (!pipeline) throw new Error('Pipeline not found');
        if (pipeline.status !== 'OFFER_EXTENDED') throw new Error('No offer extended');
        if (!pipeline.offer) throw new Error('Offer details missing');

        pipeline.status = 'OFFER_ACCEPTED';
        pipeline.offer.status = 'ACCEPTED';
        
        const candidate = this.candidates.get(pipeline.candidateId);
        const req = this.requisitions.get(pipeline.requisitionId);

        if (!candidate || !req) throw new Error('Invalid data state');

        // 🔥 Core Integration: Publish Candidate Hired Event to Digital Twin
        await eventRegistry.publish({
            eventId: crypto.randomUUID(),
            companyId: context.companyId || 'company-1',
            type: 'candidate.hired',
            actorId: context.userId,
            entityType: 'ApplicationPipeline',
            entityId: pipeline.id,
            timestamp: new Date().toISOString(),
            version: 1,
            payload: {
                candidateId: candidate.id,
                firstName: candidate.firstName,
                lastName: candidate.lastName,
                email: candidate.email,
                role: req.title,
                department: req.department,
                annualCTC: pipeline.offer.annualCTC,
                currency: pipeline.offer.currency
            }
        });
    }
}

export const recruitmentService = new RecruitmentService();
