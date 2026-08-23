export type PayrollStatus = 'DRAFT' | 'CALCULATING' | 'CALCULATED' | 'UNDER_REVIEW' | 'APPROVED' | 'FINALIZED' | 'PAID' | 'CANCELLED';

export interface SalaryComponent {
    id: string;
    code: string;
    name: string;
    type: 'EARNING' | 'DEDUCTION' | 'EMPLOYER_CONTRIBUTION';
    isTaxable: boolean;
    calculationMethod: 'FIXED' | 'PERCENTAGE_OF_BASIC' | 'PERCENTAGE_OF_GROSS' | 'FORMULA';
    value: number; // e.g., 50 for 50% or 5000 for Fixed
}

export interface EmployeeCompensation {
    employeeId: string;
    effectiveFrom: string;
    effectiveTo?: string;
    currency: string;
    annualCTC: number;
    monthlyBasic: number;
    components: SalaryComponent[];
}

export interface PayrollInput {
    employeeId: string;
    type: 'ATTENDANCE_DAYS' | 'OVERTIME_HOURS' | 'BONUS' | 'LOAN_DEDUCTION';
    value: number;
    source: string; // e.g., 'AttendanceModule', 'Manual'
}

export interface PayrollRun {
    id: string;
    companyId: string;
    periodName: string; // e.g., 'August 2026'
    startDate: string;
    endDate: string;
    payDate: string;
    status: PayrollStatus;
    totalGross: number;
    totalDeductions: number;
    totalNet: number;
    employeeResults: PayrollEmployeeResult[];
}

export interface PayrollEmployeeResult {
    employeeId: string;
    gross: number;
    deductions: number;
    tax: number;
    net: number;
    breakdown: {
        code: string;
        name: string;
        amount: number;
        type: 'EARNING' | 'DEDUCTION' | 'TAX';
    }[];
    calculationTrace: string[]; // Explanations for the Why engine
}

export interface Payslip {
    id: string;
    runId: string;
    employeeId: string;
    periodName: string;
    payDate: string;
    earnings: { name: string; amount: number }[];
    deductions: { name: string; amount: number }[];
    netPay: number;
}
