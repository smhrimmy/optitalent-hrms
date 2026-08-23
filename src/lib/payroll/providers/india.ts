import { CountryPayrollProvider } from './base';
import { EmployeeCompensation } from '../types';

export class IndiaPayrollProvider implements CountryPayrollProvider {
    countryCode = 'IN';

    calculateStatutory(compensation: EmployeeCompensation, grossPay: number, trace: string[]): { name: string; amount: number; code: string }[] {
        const statutory = [];
        
        // Basic PF Calculation (12% of Basic, typically capped at 1800 if basic > 15000, 
        // but for simplicity in this demo engine we'll do a flat 12% of monthly basic)
        const pfAmount = Math.round(compensation.monthlyBasic * 0.12);
        statutory.push({ name: 'Provident Fund (PF)', amount: pfAmount, code: 'STAT_PF' });
        trace.push(`Calculated Statutory: Provident Fund (PF) = 12% of Basic (₹${compensation.monthlyBasic}) = ₹${pfAmount}`);

        // Professional Tax (Mock rule: 200 per month)
        if (grossPay > 15000) {
            statutory.push({ name: 'Professional Tax (PT)', amount: 200, code: 'STAT_PT' });
            trace.push(`Calculated Statutory: Professional Tax (PT) = ₹200 (Gross > 15000)`);
        }

        return statutory;
    }

    calculateTaxes(compensation: EmployeeCompensation, taxableGross: number, trace: string[]): { name: string; amount: number; code: string }[] {
        // Simplified TDS calculation (flat 10% on taxable gross for demo purposes)
        // In a real system, this evaluates the old/new tax regime slabs.
        const tdsAmount = Math.round(taxableGross * 0.10);
        trace.push(`Calculated Tax: TDS = 10% of Taxable Gross (₹${taxableGross}) = ₹${tdsAmount}`);

        return [{ name: 'Tax Deducted at Source (TDS)', amount: tdsAmount, code: 'TAX_TDS' }];
    }

    validateCompensation(compensation: EmployeeCompensation): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        if (!compensation.monthlyBasic) errors.push('Monthly Basic is required for India payroll.');
        return { isValid: errors.length === 0, errors };
    }
}

export const indiaProvider = new IndiaPayrollProvider();
