import { describe, it, expect } from 'vitest';
import { payrollEngine } from '../../src/lib/payroll/engine';
import { EmployeeCompensation, PayrollInput } from '../../src/lib/payroll/types';

describe('Payroll Calculation Engine (India)', () => {

    it('calculates gross, statutory deductions, tax, and net pay correctly', () => {
        const comp: EmployeeCompensation = {
            employeeId: 'emp-1',
            effectiveFrom: '2026-01-01',
            currency: 'INR',
            annualCTC: 1200000,
            monthlyBasic: 50000,
            components: [
                { id: 'c1', code: 'BASIC', name: 'Basic Pay', type: 'EARNING', isTaxable: true, calculationMethod: 'FIXED', value: 50000 },
                { id: 'c2', code: 'HRA', name: 'HRA', type: 'EARNING', isTaxable: true, calculationMethod: 'PERCENTAGE_OF_BASIC', value: 40 }
            ]
        };

        const inputs: PayrollInput[] = [
            { employeeId: 'emp-1', type: 'BONUS', value: 10000, source: 'BonusEngine' }
        ];

        const result = payrollEngine.calculateEmployeePayroll(comp, inputs, 'IN');

        // Gross = Basic (50k) + HRA (40% of 50k = 20k) + Bonus (10k) = 80k
        expect(result.gross).toBe(80000);

        // Statutory = PF (12% of 50k = 6k) + PT (200) = 6200
        expect(result.deductions).toBe(6200);

        // Taxable Gross = 80k - 6200 = 73800
        // TDS = 10% of 73800 = 7380
        expect(result.tax).toBe(7380);

        // Net = Gross (80k) - Deductions (6200) - Tax (7380) = 66420
        expect(result.net).toBe(66420);

        expect(result.calculationTrace.length).toBeGreaterThan(0);
    });

    it('throws error for unsupported country localization', () => {
        const comp: EmployeeCompensation = {
            employeeId: 'emp-1', effectiveFrom: '2026-01-01', currency: 'USD',
            annualCTC: 120000, monthlyBasic: 5000, components: []
        };
        
        expect(() => payrollEngine.calculateEmployeePayroll(comp, [], 'US')).toThrow(/not currently configured/);
    });
});
