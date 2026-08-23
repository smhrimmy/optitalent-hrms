import { CountryCode, GlobalEmployeeContext } from '../../entity';
import { Money } from '../../currency';
import { ICountryProvider, PayrollCalculation, LeaveEntitlement } from './base';

export class IndiaProvider implements ICountryProvider {
    countryCode: CountryCode = 'IN';
    name = 'India';

    calculatePayroll(baseSalary: Money, context: GlobalEmployeeContext): PayrollCalculation {
        if (baseSalary.currency !== 'INR') {
            throw new Error('India payroll must be calculated in INR.');
        }

        // Extremely simplified mock India payroll calculation
        const pfEmployee = baseSalary.amount * 0.12;
        const pfEmployer = baseSalary.amount * 0.12;
        
        const pt = 200; // Professional Tax
        
        // Mock Income Tax (TDS)
        const tds = baseSalary.amount > 50000 ? baseSalary.amount * 0.1 : 0;

        const netPay = baseSalary.amount - pfEmployee - pt - tds;

        return {
            grossPay: baseSalary,
            netPay: { amount: netPay, currency: 'INR' },
            statutoryDeductions: [
                { name: 'Provident Fund (Employee)', amount: { amount: pfEmployee, currency: 'INR' }, employerContribution: { amount: pfEmployer, currency: 'INR' } },
                { name: 'Professional Tax', amount: { amount: pt, currency: 'INR' } }
            ],
            taxes: { amount: tds, currency: 'INR' }
        };
    }

    getStatutoryLeaveEntitlements(context: GlobalEmployeeContext): LeaveEntitlement[] {
        return [
            { type: 'ANNUAL', daysPerYear: 15 },
            { type: 'SICK', daysPerYear: 12, requiresMedicalCertificate: true },
            { type: 'MATERNITY', daysPerYear: 182 }, // 26 weeks
            { type: 'PUBLIC_HOLIDAY', daysPerYear: 10 }
        ];
    }

    getStandardWorkWeekHours(): number {
        return 45; // Commonly 9 hours * 5 days or 48 max statutory
    }

    getTerminationNoticePeriodDays(tenureYears: number): number {
        return 30; // Standard minimum, often contractually higher
    }
}
