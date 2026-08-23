import { describe, it, expect, vi } from 'vitest';
import { recruitmentService } from '../../src/lib/recruitment/service';
import { eventRegistry } from '../../src/lib/events/registry';

describe('Recruitment Workflow to Employee Conversion', () => {

    it('publishes candidate.hired event when an offer is accepted', async () => {
        const spy = vi.spyOn(eventRegistry, 'publish');
        
        const context = { tenantId: 'tenant-1', userId: 'recruiter', roles: ['Recruiter'] };
        
        const req = await recruitmentService.createRequisition(context, {
            id: 'req-1', title: 'Eng', department: 'Tech', location: 'Rem', type: 'FULL_TIME',
            status: 'OPEN', requiredSkills: [], preferredSkills: [], minExperienceYears: 1, headcountTarget: 1, headcountFilled: 0
        });

        const pipeline = await recruitmentService.apply({
            id: 'cand-1', firstName: 'John', lastName: 'Doe', email: 'j@d.com', extractedSkills: [], extractedExperienceYears: 1
        }, req.id);

        // Fast forward to offer
        pipeline.status = 'OFFER_EXTENDED';
        pipeline.offer = { id: 'offer-1', annualCTC: 100000, currency: 'USD', status: 'EXTENDED', validUntil: '2026-12-31' };

        await recruitmentService.acceptOffer(context, pipeline.id);

        expect(pipeline.status).toBe('OFFER_ACCEPTED');
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            type: 'candidate.hired',
            payload: expect.objectContaining({ candidateId: 'cand-1', role: 'Eng' })
        }));
    });
});
