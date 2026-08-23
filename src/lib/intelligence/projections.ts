import { DomainEvent } from '../events/types';
import { eventRegistry } from '../events/registry';
import { DigitalTwinGraph } from './models';

// In-memory mock database for Digital Twins by Company
const digitalTwins = new Map<string, DigitalTwinGraph>();

export function getDigitalTwin(companyId: string): DigitalTwinGraph {
    let twin = digitalTwins.get(companyId);
    if (!twin) {
        twin = {
            companyId,
            lastUpdated: new Date().toISOString(),
            organizationNodes: new Map(),
            employees: new Map(),
            historicalHeadcount: []
        };
        digitalTwins.set(companyId, twin);
    }
    return twin;
}

/**
 * Projection Handlers that listen to Domain Events and update the Digital Twin Graph.
 */
eventRegistry.subscribe('leave.submitted', async (event: DomainEvent) => {
    const twin = getDigitalTwin(event.companyId);
    const employee = twin.employees.get(event.actorId);
    
    if (employee) {
        // Adjust analytical projections based on leave (e.g. projecting capacity drop)
        const duration = event.payload.duration || 0;
        employee.leaveBalanceDays = Math.max(0, employee.leaveBalanceDays - duration);
        twin.lastUpdated = new Date().toISOString();
    }
});

eventRegistry.subscribe('employee.created', async (event: DomainEvent) => {
    const twin = getDigitalTwin(event.companyId);
    
    twin.employees.set(event.entityId, {
        id: event.entityId,
        name: event.payload.name,
        departmentId: event.payload.departmentId,
        jobRole: event.payload.jobRole,
        skills: [],
        activeProjects: [],
        leaveBalanceDays: 20,
        projectAllocationPercentage: 0
    });

    // Update Headcount Node
    const deptNode = twin.organizationNodes.get(event.payload.departmentId);
    if (deptNode) {
        deptNode.activeHeadcount += 1;
    }
    
    twin.lastUpdated = new Date().toISOString();
});
