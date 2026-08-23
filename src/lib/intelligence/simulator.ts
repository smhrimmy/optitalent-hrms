import { DigitalTwinGraph } from './models';
import { getDigitalTwin } from './projections';

export interface SimulationResult {
    scenarioName: string;
    metrics: {
        originalHeadcount: number;
        simulatedHeadcount: number;
        originalManagerSpanHighRiskCount: number;
        simulatedManagerSpanHighRiskCount: number;
    }
}

export class WorkforceSimulator {
    
    /**
     * Deep clones the current digital twin state to ensure the simulator never mutates production data.
     */
    private cloneTwin(twin: DigitalTwinGraph): DigitalTwinGraph {
        return JSON.parse(JSON.stringify(twin)); // Simplistic deep clone for demo purposes
    }

    /**
     * Simulates the impact of hiring N new employees into a specific department under a specific manager.
     */
    simulateHiringEvent(companyId: string, count: number, departmentId: string, managerId: string): SimulationResult {
        const prodTwin = getDigitalTwin(companyId);
        const simTwin = this.cloneTwin(prodTwin);

        const originalHeadcount = simTwin.employees.size;
        
        let originalHighRiskSpanCount = 0;
        let simHighRiskSpanCount = 0;

        // Baseline Manager Span
        const managerDirects = new Map<string, number>();
        for (const emp of simTwin.employees.values()) {
            if (emp.managerId) {
                managerDirects.set(emp.managerId, (managerDirects.get(emp.managerId) || 0) + 1);
            }
        }
        
        for (const count of managerDirects.values()) {
            if (count > 12) originalHighRiskSpanCount++;
        }

        // Apply Scenario
        for (let i = 0; i < count; i++) {
            simTwin.employees.set(`sim-emp-${i}`, {
                id: `sim-emp-${i}`,
                name: `Simulated Hire ${i}`,
                departmentId,
                managerId,
                jobRole: 'TBD',
                skills: [],
                activeProjects: [],
                leaveBalanceDays: 0,
                projectAllocationPercentage: 0
            });
            managerDirects.set(managerId, (managerDirects.get(managerId) || 0) + 1);
        }

        const simulatedHeadcount = simTwin.employees.size;
        
        for (const count of managerDirects.values()) {
            if (count > 12) simHighRiskSpanCount++;
        }

        return {
            scenarioName: `Hire ${count} into ${departmentId}`,
            metrics: {
                originalHeadcount,
                simulatedHeadcount,
                originalManagerSpanHighRiskCount: originalHighRiskSpanCount,
                simulatedManagerSpanHighRiskCount: simHighRiskSpanCount
            }
        };
    }
}

export const workforceSimulator = new WorkforceSimulator();
