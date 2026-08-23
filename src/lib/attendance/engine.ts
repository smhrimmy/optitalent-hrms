import { WorkSchedule, AttendancePunch, AttendanceResult, CalculationTraceStep } from './types';

export class TimeEngine {
    
    /**
     * Evaluates actual punches against the schedule to generate an explainable AttendanceResult.
     */
    evaluatePunches(
        employeeId: string, 
        date: string, 
        schedule: WorkSchedule, 
        punches: AttendancePunch[]
    ): AttendanceResult {
        
        const trace: CalculationTraceStep[] = [];
        let status: AttendanceResult['status'] = 'ABSENT';
        let lateMinutes = 0;
        let earlyDepartureMinutes = 0;
        let overtimeMinutes = 0;

        // Sort punches by time
        const sortedPunches = [...punches].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const inPunch = sortedPunches.find(p => p.type === 'IN');
        const outPunch = sortedPunches.reverse().find(p => p.type === 'OUT'); // Get the last OUT punch

        if (!inPunch) {
            trace.push({ rule: 'Clock In', evaluation: 'No IN punch found for the day.', passed: false });
            return { id: `res-${date}`, employeeId, date, schedule, punches, status: 'ABSENT', lateMinutes: 0, earlyDepartureMinutes: 0, overtimeMinutes: 0, calculationTrace: trace };
        }

        trace.push({ rule: 'Clock In', evaluation: `IN punch found at ${new Date(inPunch.timestamp).toLocaleTimeString()}`, passed: true });
        status = 'PRESENT'; // At least showed up

        if (schedule.type === 'FIXED' && schedule.startTime && schedule.endTime) {
            // Helper to parse HH:mm to minutes from midnight
            const parseTime = (timeStr: string) => {
                const [h, m] = timeStr.split(':').map(Number);
                return h * 60 + m;
            };

            const scheduledStart = parseTime(schedule.startTime);
            const actualStart = inPunch.timestamp ? new Date(inPunch.timestamp).getHours() * 60 + new Date(inPunch.timestamp).getMinutes() : 0;
            
            trace.push({ rule: 'Scheduled Shift', evaluation: `Scheduled for ${schedule.type} Shift`, passed: true });
            trace.push({ rule: 'Grace Period', evaluation: `Grace period allows ${schedule.gracePeriodMinutes} minutes delay`, passed: true });

            if (actualStart > scheduledStart + schedule.gracePeriodMinutes) {
                lateMinutes = actualStart - scheduledStart;
                trace.push({ rule: 'Late Arrival Check', evaluation: `Actual arrival (${actualStart}m) exceeded scheduled start (${scheduledStart}m) by ${lateMinutes} minutes`, passed: false });
                status = 'ANOMALY';
            } else {
                trace.push({ rule: 'Late Arrival Check', evaluation: 'Arrived within grace period', passed: true });
            }

            if (outPunch) {
                const scheduledEnd = parseTime(schedule.endTime);
                const actualEnd = new Date(outPunch.timestamp).getHours() * 60 + new Date(outPunch.timestamp).getMinutes();

                if (actualEnd < scheduledEnd) {
                    earlyDepartureMinutes = scheduledEnd - actualEnd;
                    trace.push({ rule: 'Early Departure Check', evaluation: `Departed ${earlyDepartureMinutes} minutes early`, passed: false });
                    status = 'ANOMALY';
                }

                if (actualEnd > scheduledEnd) {
                    overtimeMinutes = actualEnd - scheduledEnd;
                    trace.push({ rule: 'Overtime Check', evaluation: `Stayed ${overtimeMinutes} minutes past scheduled end. Requires manager approval.`, passed: false });
                    status = 'ANOMALY';
                }
            } else {
                trace.push({ rule: 'Missing Punch', evaluation: 'No OUT punch found for the day.', passed: false });
                status = 'ANOMALY';
            }
        }

        return {
            id: `res-${date}`,
            employeeId,
            date,
            schedule,
            punches,
            status,
            lateMinutes,
            earlyDepartureMinutes,
            overtimeMinutes,
            calculationTrace: trace
        };
    }
}

export const timeEngine = new TimeEngine();
