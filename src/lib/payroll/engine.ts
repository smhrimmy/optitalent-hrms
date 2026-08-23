import { EmployeeCompensation, PayrollInput, PayrollEmployeeResult } from './types';
import { CountryPayrollProvider } from './providers/base';
import { indiaProvider } from './providers/india';

export class PayrollEngine {
    /**
     * Factory to get the correct provider based on company DNA / country.
     */
    getProvider(countryCode: string): CountryPayrollProvider {
        if (countryCode === 'IN') return indiaProvider;
        throw new Error(`Payroll localization is not currently configured for country: ${countryCode}`);
    }

    /**
     * The core pipeline:
     * Inputs -> Earnings -> Gross -> Pre-tax Deductions -> Tax/Statutory -> Post-tax -> Net
     */
    calculateEmployeePayroll(
        compensation: EmployeeCompensation,
        inputs: PayrollInput[],
        countryCode: string
    ): PayrollEmployeeResult {
        const trace: string[] = [];
        const breakdown: { code: string; name: string; amount: number; type: 'EARNING'|'DEDUCTION'|'TAX' }[] = [];
        
        const provider = this.getProvider(countryCode);
        const validation = provider.validateCompensation(compensation);
        if (!validation.isValid) {
            throw new Error(`Invalid compensation: ${validation.errors.join(', ')}`);
        }

        trace.push(`Started calculation for employee ${compensation.employeeId} using ${countryCode} provider`);

        let gross = 0;
        let preTaxDeductions = 0;

        // 1. Calculate Earnings from Components
        for (const comp of compensation.components) {
            if (comp.type === 'EARNING') {
                let amount = 0;
                if (comp.calculationMethod === 'FIXED') {
                    amount = comp.value;
                    trace.push(`Added Fixed Earning: ${comp.name} = ₹${amount}`);
                } else if (comp.calculationMethod === 'PERCENTAGE_OF_BASIC') {
                    amount = Math.round(compensation.monthlyBasic * (comp.value / 100));
                    trace.push(`Added Percentage Earning: ${comp.name} = ${comp.value}% of Basic (₹${compensation.monthlyBasic}) = ₹${amount}`);
                }
                gross += amount;
                breakdown.push({ code: comp.code, name: comp.name, amount, type: 'EARNING' });
            }
        }

        // 2. Add Dynamic Inputs (Overtime, Bonus)
        for (const input of inputs) {
            if (input.type === 'OVERTIME_HOURS') {
                // Mock rate 500/hr
                const overtimeAmount = input.value * 500;
                gross += overtimeAmount;
                breakdown.push({ code: 'INPUT_OT', name: `Overtime (${input.value} hrs)`, amount: overtimeAmount, type: 'EARNING' });
                trace.push(`Added Input: Overtime ${input.value} hrs from ${input.source} = ₹${overtimeAmount}`);
            } else if (input.type === 'BONUS') {
                gross += input.value;
                breakdown.push({ code: 'INPUT_BONUS', name: 'Bonus', amount: input.value, type: 'EARNING' });
                trace.push(`Added Input: Bonus from ${input.source} = ₹${input.value}`);
            } else if (input.type === 'LOAN_DEDUCTION') {
                preTaxDeductions += input.value;
                breakdown.push({ code: 'INPUT_LOAN', name: 'Loan Installment', amount: input.value, type: 'DEDUCTION' });
                trace.push(`Added Deduction Input: Loan Installment from ${input.source} = ₹${input.value}`);
            }
        }

        // 3. Statutory Deductions
        const statutory = provider.calculateStatutory(compensation, gross, trace);
        for (const stat of statutory) {
            preTaxDeductions += stat.amount;
            breakdown.push({ code: stat.code, name: stat.name, amount: stat.amount, type: 'DEDUCTION' });
        }

        // 4. Taxes
        const taxableGross = Math.max(0, gross - preTaxDeductions);
        const taxes = provider.calculateTaxes(compensation, taxableGross, trace);
        let taxTotal = 0;
        for (const tax of taxes) {
            taxTotal += tax.amount;
            breakdown.push({ code: tax.code, name: tax.name, amount: tax.amount, type: 'TAX' });
        }

        // 5. Net Pay
        const totalDeductions = preTaxDeductions + taxTotal;
        const net = Math.max(0, gross - totalDeductions);
        
        trace.push(`Final Calculation: Gross (₹${gross}) - Deductions (₹${preTaxDeductions}) - Tax (₹${taxTotal}) = Net (₹${net})`);

        return {
            employeeId: compensation.employeeId,
            gross,
            deductions: preTaxDeductions,
            tax: taxTotal,
            net,
            breakdown,
            calculationTrace: trace
        };
    }
}

export const payrollEngine = new PayrollEngine();
