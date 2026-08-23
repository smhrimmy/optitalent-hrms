import { CountryCode, GlobalEmployeeContext } from '../entity';
import { Money } from '../currency';

export interface StatutoryDeduction {
    name: string;
    amount: Money;
    employerContribution?: Money;
}

export interface PayrollCalculation {
    grossPay: Money;
    netPay: Money;
    statutoryDeductions: StatutoryDeduction[];
    taxes: Money;
}

export interface LeaveEntitlement {
    type: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'PUBLIC_HOLIDAY';
    daysPerYear: number;
    requiresMedicalCertificate?: boolean;
}

export interface ICountryProvider {
    countryCode: CountryCode;
    name: string;
    
    // Payroll & Tax
    calculatePayroll(baseSalary: Money, context: GlobalEmployeeContext): PayrollCalculation;
    
    // Time & Leave
    getStatutoryLeaveEntitlements(context: GlobalEmployeeContext): LeaveEntitlement[];
    getStandardWorkWeekHours(): number;
    
    // Lifecycle
    getTerminationNoticePeriodDays(tenureYears: number): number;
}
