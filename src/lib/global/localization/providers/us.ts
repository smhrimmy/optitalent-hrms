import { CountryCode, GlobalEmployeeContext } from '../../entity';
import { Money } from '../../currency';
import { ICountryProvider, PayrollCalculation, LeaveEntitlement } from './base';

export class UnitedStatesProvider implements ICountryProvider {
    countryCode: CountryCode = 'US';
    name = 'United States';

    calculatePayroll(baseSalary: Money, context: GlobalEmployeeContext): PayrollCalculation {
        if (baseSalary.currency !== 'USD') {
            throw new Error('US payroll must be calculated in USD.');
        }

        // Extremely simplified mock US payroll calculation
        const ficaSS = baseSalary.amount * 0.062; // Social Security 6.2%
        const ficaMed = baseSalary.amount * 0.0145; // Medicare 1.45%
        
        // Mock Federal & State Tax Withholding
        const tax = baseSalary.amount * 0.22; 

        const netPay = baseSalary.amount - ficaSS - ficaMed - tax;

        return {
            grossPay: baseSalary,
            netPay: { amount: netPay, currency: 'USD' },
            statutoryDeductions: [
                { name: 'Social Security (FICA)', amount: { amount: ficaSS, currency: 'USD' }, employerContribution: { amount: ficaSS, currency: 'USD' } },
                { name: 'Medicare (FICA)', amount: { amount: ficaMed, currency: 'USD' }, employerContribution: { amount: ficaMed, currency: 'USD' } }
            ],
            taxes: { amount: tax, currency: 'USD' }
        };
    }

    getStatutoryLeaveEntitlements(context: GlobalEmployeeContext): LeaveEntitlement[] {
        // Federal US has virtually no statutory leave. States vary, but we default to zero federally.
        return [
            { type: 'ANNUAL', daysPerYear: 0 }, 
            { type: 'SICK', daysPerYear: 0 },
            { type: 'MATERNITY', daysPerYear: 0 }, // FMLA is unpaid, not a paid entitlement
            { type: 'PUBLIC_HOLIDAY', daysPerYear: 0 }
        ];
    }

    getStandardWorkWeekHours(): number {
        return 40; // FLSA standard
    }

    getTerminationNoticePeriodDays(tenureYears: number): number {
        return 0; // At-will employment
    }
}
