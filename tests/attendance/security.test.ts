import { describe, it, expect } from 'vitest';
import { attendanceService } from '../../src/lib/attendance/service';
import { WorkSchedule } from '../../src/lib/attendance/types';

describe('Attendance Security Boundary', () => {

    it('blocks a punch if it violates geofence/IP restrictions', async () => {
        const schedule: WorkSchedule = {
            id: 'sch-1', type: 'FIXED', gracePeriodMinutes: 15, 
            requireGeofence: true, allowedIPs: ['192.168.1.100']
        };

        const context = { tenantId: 'tenant-1', userId: 'emp-1', roles: ['Employee'] };

        await expect(attendanceService.submitPunch(context, { 
            id: 'p1', employeeId: 'emp-1', timestamp: '2026-08-22T09:00:00Z', 
            type: 'IN', source: 'WEB', ipAddress: '10.0.0.5' // Invalid IP
        }, schedule)).rejects.toThrow('Punch blocked: Invalid IP address');
    });
});
