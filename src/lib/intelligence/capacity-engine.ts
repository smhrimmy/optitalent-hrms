import { getDigitalTwin } from './projections';

export interface ManagerCapacity {
    managerId: string;
    directReportsCount: number;
    spanStatus: 'Optimal' | 'High' | 'Low';
}

export class CapacityEngine {
    
    analyzeManagerSpan(tenantId: string, managerId: string): ManagerCapacity {
        const twin = getDigitalTwin(tenantId);
        
        let directReports = 0;
        for (const emp of twin.employees.values()) {
            if (emp.managerId === managerId) {
                directReports++;
            }
        }

        let spanStatus: 'Optimal' | 'High' | 'Low' = 'Optimal';
        if (directReports > 12) spanStatus = 'High'; // Potential bottleneck
        if (directReports < 3) spanStatus = 'Low';

        return {
            managerId,
            directReportsCount: directReports,
            spanStatus
        };
    }
}

export const capacityEngine = new CapacityEngine();
