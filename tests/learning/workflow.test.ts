import { describe, it, expect, vi } from 'vitest';
import { learningService } from '../../src/lib/learning/service';
import { eventRegistry } from '../../src/lib/events/registry';

describe('Learning to Digital Twin Workflow', () => {

    it('publishes skill.evidence_added when an assessment is passed', async () => {
        const spy = vi.spyOn(eventRegistry, 'publish');
        const context = { tenantId: 'tenant-1', userId: 'emp-1', roles: ['Employee'] };

        // We bypass the need for a real course lookup by assuming the course exists or skillsToUpdate is empty in the mock,
        // but for this test we actually want to test the event. Let's mock the internal course map.
        (learningService as any).courses.set('c-1', {
            id: 'c-1', tenantId: 'tenant-1', title: 'Test', description: '', category: '', difficulty: 'BEGINNER',
            durationHours: 1, provider: 'Internal', status: 'PUBLISHED',
            skillsTargeted: [{ skill: 'AWS', targetProficiency: 50 }]
        });

        const enrollment = await learningService.enroll(context, 'emp-1', 'c-1');
        
        await learningService.submitAssessment(context, enrollment.id, 'assess-1', 95, 80, 'c-1');

        expect(enrollment.status).toBe('COMPLETED');
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            type: 'skill.evidence_added',
            payload: expect.objectContaining({ 
                skill: 'AWS', 
                source: 'COURSE_ASSESSMENT',
                verificationStatus: 'VERIFIED'
            })
        }));
    });
});
