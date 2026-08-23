import { PayrollRun, PayrollStatus, EmployeeCompensation, PayrollInput, PayrollEmployeeResult } from './types';
import { payrollEngine } from './engine';
import { workflowEngine } from '../workflows/engine';
import { eventRegistry } from '../events/registry';
import { PermissionService } from '../permissions';

export class PayrollService {
    // In-memory store for demo
    private runs: Map<string, PayrollRun> = new Map();

    async calculateRun(context: any, runId: string, compensations: EmployeeCompensation[], inputs: PayrollInput[], countryCode: string): Promise<PayrollRun> {
        const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');;

        const run = this.runs.get(runId) || {
            id: runId,
            companyId: context.companyId,
            periodName: 'August 2026',
            startDate: '2026-08-01',
            endDate: '2026-08-31',
            payDate: '2026-08-31',
            status: 'CALCULATING',
            totalGross: 0,
            totalDeductions: 0,
            totalNet: 0,
            employeeResults: []
        };
        run.status = 'CALCULATING';

        const results: PayrollEmployeeResult[] = [];
        let totalGross = 0;
        let totalDeductions = 0;
        let totalNet = 0;

        for (const comp of compensations) {
            const empInputs = inputs.filter(i => i.employeeId === comp.employeeId);
            const res = payrollEngine.calculateEmployeePayroll(comp, empInputs, countryCode);
            results.push(res);
            
            totalGross += res.gross;
            totalDeductions += res.deductions + res.tax;
            totalNet += res.net;
        }

        run.employeeResults = results;
        run.totalGross = totalGross;
        run.totalDeductions = totalDeductions;
        run.totalNet = totalNet;
        run.status = 'CALCULATED';

        this.runs.set(runId, run);

        // Fire Workflow Event (e.g. requires Finance Approval if totalNet > $1M)
        /*
        await workflowEngine.startExecution('payroll.calculated', 'calculate-run', {
            companyId: context.companyId,
            initiatingUserId: context.userId,
            runId, totalNet
        });
        */

        return run;
    }

    async finalizeRun(context: any, runId: string): Promise<PayrollRun> {
        const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');;

        const run = this.runs.get(runId);
        if (!run) throw new Error('Payroll run not found.');
        if (run.status === 'FINALIZED') throw new Error('Payroll run is already finalized.');

        run.status = 'FINALIZED';
        this.runs.set(runId, run);

        // Publish to Digital Twin
        const crypto = await import('crypto');
        await eventRegistry.publish({
            eventId: crypto.randomUUID(),
            companyId: context.companyId,
            type: 'payroll.finalized',
            actorId: context.userId,
            entityType: 'PayrollRun',
            entityId: runId,
            timestamp: new Date().toISOString(),
            version: 1,
            payload: {
                periodName: run.periodName,
                totalGross: run.totalGross,
                totalNet: run.totalNet,
                employeeCount: run.employeeResults.length
            }
        });

        return run;
    }
}

export const payrollService = new PayrollService();
