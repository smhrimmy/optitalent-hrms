import { AttendancePunch, WorkSchedule, Exception, AttendanceResult } from './types';
import { timeEngine } from './engine';
import { eventRegistry } from '../events/registry';
import { authorize } from '../authorization/engine';
import crypto from 'crypto';

export class AttendanceService {
    private punches: AttendancePunch[] = [];
    private exceptions: Exception[] = [];

    async submitPunch(context: any, punch: AttendancePunch, schedule: WorkSchedule): Promise<AttendanceResult> {
        const authResult = authorize({
            context,
            resource: 'attendance:punch',
            action: 'create'
        });
        if (!authResult.allowed) throw new Error(`Forbidden: ${authResult.reason}`);

        // IP / Geofence Security Validation
        if (schedule.requireGeofence && schedule.allowedIPs) {
            if (!punch.ipAddress || !schedule.allowedIPs.includes(punch.ipAddress)) {
                throw new Error('Punch blocked: Invalid IP address for scheduled shift.');
            }
        }

        this.punches.push(punch);

        // Re-evaluate the day
        const dayPunches = this.punches.filter(p => p.employeeId === punch.employeeId && p.timestamp.startsWith(punch.timestamp.split('T')[0]));
        const result = timeEngine.evaluatePunches(punch.employeeId, punch.timestamp.split('T')[0], schedule, dayPunches);

        // If anomaly generates an exception needing approval
        if (result.status === 'ANOMALY') {
            if (result.overtimeMinutes > 0) {
                this.exceptions.push({
                    id: crypto.randomUUID(),
                    attendanceResultId: result.id,
                    employeeId: result.employeeId,
                    type: 'OVERTIME',
                    status: 'PENDING'
                });
            }
        }

        return result;
    }

    async approveException(context: any, exceptionId: string, notes: string): Promise<void> {
        const authResult = authorize({
            context,
            resource: 'attendance:exception',
            action: 'approve'
        });
        if (!authResult.allowed) throw new Error(`Forbidden: ${authResult.reason}`);

        const exception = this.exceptions.find(e => e.id === exceptionId);
        if (!exception) throw new Error('Exception not found');

        exception.status = 'APPROVED';
        exception.managerId = context.userId;
        exception.managerNotes = notes;

        // Propagate to Payroll Domain via Event Registry
        if (exception.type === 'OVERTIME') {
            await eventRegistry.publish({
                eventId: crypto.randomUUID(),
                companyId: context.companyId || 'company-1',
                type: 'payroll.overtime_approved',
                actorId: context.userId,
                entityType: 'Employee',
                entityId: exception.employeeId,
                timestamp: new Date().toISOString(),
                version: 1,
                payload: {
                    attendanceResultId: exception.attendanceResultId,
                    minutes: 60 // Should pull from result
                }
            });
        }
    }
}

export const attendanceService = new AttendanceService();
