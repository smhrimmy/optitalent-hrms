import { describe, it, expect, vi } from 'vitest';
import { attendanceService } from '../../src/lib/attendance/service';
import { eventRegistry } from '../../src/lib/events/registry';
import { WorkSchedule } from '../../src/lib/attendance/types';

describe('Attendance to Payroll Workflow', () => {

    it('publishes payroll.overtime_approved when an overtime exception is approved', async () => {
        const spy = vi.spyOn(eventRegistry, 'publish');
        
        const schedule: WorkSchedule = {
            id: 'sch-1', type: 'FIXED', startTime: '09:00', endTime: '18:00', gracePeriodMinutes: 15, requireGeofence: false
        };

        const empContext = { tenantId: 'tenant-1', userId: 'emp-1', roles: ['Employee'] };

        // Employee punches in and out (with overtime)
        await attendanceService.submitPunch(empContext, { id: 'p1', employeeId: 'emp-1', timestamp: '2026-08-22T09:00:00Z', type: 'IN', source: 'WEB' }, schedule);
        await attendanceService.submitPunch(empContext, { id: 'p2', employeeId: 'emp-1', timestamp: '2026-08-22T19:00:00Z', type: 'OUT', source: 'WEB' }, schedule);

        // Find the generated exception (in a real DB we'd query it)
        const exceptions = (attendanceService as any).exceptions;
        const overtimeException = exceptions.find((e: any) => e.employeeId === 'emp-1' && e.type === 'OVERTIME');

        expect(overtimeException).toBeDefined();

        // Manager approves
        const mgrContext = { tenantId: 'tenant-1', userId: 'mgr-1', roles: ['Manager'] };
        await attendanceService.approveException(mgrContext, overtimeException.id, 'Approved due to critical release.');

        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            type: 'payroll.overtime_approved',
            payload: expect.objectContaining({ attendanceResultId: overtimeException.attendanceResultId })
        }));
    });
});
