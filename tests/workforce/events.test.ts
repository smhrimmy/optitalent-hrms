import { describe, it, expect } from 'vitest';
import { eventRegistry } from '../../src/lib/events/registry';
import { getDigitalTwin } from '../../src/lib/intelligence/projections';

describe('Domain Event to Digital Twin Projection', () => {

    it('projects employee creation into the twin', async () => {
        const tenantId = 'event-test-tenant';
        
        await eventRegistry.publish({
            eventId: '1',
            tenantId,
            type: 'employee.created',
            actorId: 'system',
            entityType: 'Employee',
            entityId: 'emp-101',
            timestamp: new Date().toISOString(),
            version: 1,
            payload: {
                name: 'Alice',
                departmentId: 'dept-eng',
                jobRole: 'Engineer'
            }
        });

        const twin = getDigitalTwin(tenantId);
        const emp = twin.employees.get('emp-101');
        
        expect(emp).toBeDefined();
        expect(emp?.name).toBe('Alice');
        expect(emp?.leaveBalanceDays).toBe(20);
    });

    it('projects leave submission into the twin', async () => {
        const tenantId = 'event-test-tenant';
        
        await eventRegistry.publish({
            eventId: '2',
            tenantId,
            type: 'leave.submitted',
            actorId: 'emp-101',
            entityType: 'LeaveRequest',
            entityId: 'leave-1',
            timestamp: new Date().toISOString(),
            version: 1,
            payload: {
                duration: 5,
                type: 'Annual'
            }
        });

        const twin = getDigitalTwin(tenantId);
        const emp = twin.employees.get('emp-101');
        
        expect(emp?.leaveBalanceDays).toBe(15);
    });
});
