export type AssetStatus = 
    | 'AVAILABLE' 
    | 'RESERVED' 
    | 'ASSIGNED' 
    | 'IN_REPAIR' 
    | 'LOST' 
    | 'DAMAGED' 
    | 'RETIRED' 
    | 'DISPOSED';

export interface Asset {
    id: string;
    tenantId: string;
    type: 'LAPTOP' | 'MONITOR' | 'PHONE' | 'ACCESS_CARD' | 'VEHICLE' | 'OTHER';
    name: string;
    serialNumber: string;
    status: AssetStatus;
    currentEmployeeId?: string;
    location?: string;
    purchaseDate?: Date;
}

export interface AssetAssignment {
    id: string;
    assetId: string;
    employeeId: string;
    assignedAt: Date;
    returnedAt?: Date;
    conditionOnAssignment: string;
    conditionOnReturn?: string;
}

const assetsDB = new Map<string, Asset>();
const assignmentsDB = new Map<string, AssetAssignment>();

export class AssetEngine {
    
    /**
     * Assigns a specific asset to an employee, with concurrency protection
     */
    static async assignAsset(tenantId: string, assetId: string, employeeId: string, actorId: string): Promise<AssetAssignment> {
        const asset = assetsDB.get(assetId);
        
        if (!asset) {
            throw new Error(`Asset ${assetId} not found`);
        }
        
        if (asset.tenantId !== tenantId) {
            throw new Error(`Unauthorized asset access`);
        }

        // Concurrency Protection
        if (asset.status === 'ASSIGNED' || asset.status === 'RESERVED') {
            throw new Error(`Asset ${assetId} is no longer available. It is currently ${asset.status}.`);
        }
        
        if (asset.status !== 'AVAILABLE') {
            throw new Error(`Asset ${assetId} cannot be assigned. Status: ${asset.status}`);
        }

        // Update asset status atomically
        asset.status = 'ASSIGNED';
        asset.currentEmployeeId = employeeId;
        
        const assignmentId = `asgn_${Date.now()}`;
        const assignment: AssetAssignment = {
            id: assignmentId,
            assetId,
            employeeId,
            assignedAt: new Date(),
            conditionOnAssignment: 'Good', // Default for now
        };

        assignmentsDB.set(assignmentId, assignment);
        
        // EventRegistry.publish('asset.assigned', { asset, assignment, actorId });

        return assignment;
    }

    /**
     * Returns an assigned asset to inventory
     */
    static async returnAsset(assignmentId: string, condition: string, actorId: string): Promise<void> {
        const assignment = assignmentsDB.get(assignmentId);
        if (!assignment) throw new Error('Assignment not found');
        if (assignment.returnedAt) throw new Error('Asset already returned');

        const asset = assetsDB.get(assignment.assetId);
        if (!asset) throw new Error('Asset not found');

        assignment.returnedAt = new Date();
        assignment.conditionOnReturn = condition;

        asset.status = condition === 'DAMAGED' ? 'IN_REPAIR' : 'AVAILABLE';
        asset.currentEmployeeId = undefined;

        // EventRegistry.publish('asset.returned', { asset, assignment, actorId });
    }
}
