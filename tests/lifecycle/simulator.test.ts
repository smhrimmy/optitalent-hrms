import { describe, it, expect } from 'vitest';
import { lifecycleSimulator } from '../../src/lib/lifecycle/simulator';

describe('Lifecycle Impact Simulator', () => {

    it('predicts downstream impact of a Grade 7 promotion', () => {
        const preview = lifecycleSimulator.previewImpact('emp-1', 'PROMOTION', 7, '2026-09-01');

        expect(preview.impacts).toHaveLength(4); // Comp, Benefits, Learning, Attendance
        
        const benefitsImpact = preview.impacts.find(i => i.module === 'BENEFITS');
        expect(benefitsImpact?.type).toBe('POSITIVE');
        expect(benefitsImpact?.changeSummary).toContain('Executive Health Plan');

        expect(preview.estimatedMonthlyPayrollImpact).toBe(5000);
    });
});
