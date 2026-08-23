import { PayrollEmployeeResult, EmployeeCompensation } from '../types';

/**
 * Base interface that every supported country must implement.
 * This prevents hard-coding specific tax laws into the global payroll engine.
 */
export interface CountryPayrollProvider {
    countryCode: string;

    /**
     * Calculates all country-specific statutory deductions (e.g., PF, ESI in India; Social Security in US).
     */
    calculateStatutory(compensation: EmployeeCompensation, grossPay: number, trace: string[]): { name: string; amount: number; code: string }[];

    /**
     * Calculates income tax.
     */
    calculateTaxes(compensation: EmployeeCompensation, taxableGross: number, trace: string[]): { name: string; amount: number; code: string }[];

    /**
     * Validates if the employee compensation has all required fields for this country.
     */
    validateCompensation(compensation: EmployeeCompensation): { isValid: boolean; errors: string[] };
}
