import { describe, it, expect } from 'vitest';
import { timeEngine } from '../../src/lib/attendance/engine';
import { WorkSchedule, AttendancePunch } from '../../src/lib/attendance/types';

describe('Adaptive Time Engine', () => {

    it('calculates late arrival and overtime correctly with calculation traces', () => {
        const schedule: WorkSchedule = {
            id: 'sch-1', type: 'FIXED', startTime: '09:00', endTime: '18:00', gracePeriodMinutes: 15, requireGeofence: false
        };

        const punches: AttendancePunch[] = [
            { id: 'p1', employeeId: 'emp-1', type: 'IN', source: 'WEB', timestamp: '2026-08-22T09:17:00Z' },
            { id: 'p2', employeeId: 'emp-1', type: 'OUT', source: 'WEB', timestamp: '2026-08-22T18:42:00Z' }
        ];

        const result = timeEngine.evaluatePunches('emp-1', '2026-08-22', schedule, punches);

        expect(result.status).toBe('ANOMALY');
        expect(result.lateMinutes).toBe(17); // 09:17 is 17 mins past 09:00
        expect(result.overtimeMinutes).toBe(42); // 18:42 is 42 mins past 18:00
        expect(result.earlyDepartureMinutes).toBe(0);
        
        // Verify trace contains explanation for late
        const lateCheck = result.calculationTrace.find(t => t.rule === 'Late Arrival Check');
        expect(lateCheck?.passed).toBe(false);
        expect(lateCheck?.evaluation).toContain('exceeded scheduled start');

        // Verify trace contains explanation for overtime
        const otCheck = result.calculationTrace.find(t => t.rule === 'Overtime Check');
        expect(otCheck?.passed).toBe(false);
        expect(otCheck?.evaluation).toContain('Stayed 42 minutes past');
    });
});
