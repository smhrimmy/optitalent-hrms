export interface WorkSchedule {
    id: string;
    type: 'FIXED' | 'FLEXIBLE' | 'ROSTERED';
    startTime?: string; // HH:mm
    endTime?: string; // HH:mm
    coreHoursStart?: string;
    coreHoursEnd?: string;
    gracePeriodMinutes: number;
    requireGeofence: boolean;
    allowedIPs?: string[];
}

export interface AttendancePunch {
    id: string;
    employeeId: string;
    timestamp: string; // ISO String
    type: 'IN' | 'OUT';
    source: 'WEB' | 'MOBILE' | 'BIOMETRIC';
    ipAddress?: string;
    location?: { lat: number; lng: number };
}

export interface CalculationTraceStep {
    rule: string;
    evaluation: string;
    passed: boolean;
}

export interface AttendanceResult {
    id: string;
    employeeId: string;
    date: string; // YYYY-MM-DD
    schedule: WorkSchedule;
    punches: AttendancePunch[];
    status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ANOMALY';
    lateMinutes: number;
    earlyDepartureMinutes: number;
    overtimeMinutes: number;
    calculationTrace: CalculationTraceStep[];
}

export interface Exception {
    id: string;
    attendanceResultId: string;
    employeeId: string;
    type: 'OVERTIME' | 'MISSING_PUNCH' | 'LATE_ARRIVAL';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    managerId?: string;
    managerNotes?: string;
}
