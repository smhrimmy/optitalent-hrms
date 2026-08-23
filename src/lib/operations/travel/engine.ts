export interface Trip {
    id: string;
    tenantId: string;
    employeeId: string;
    origin: string;
    destination: string;
    purpose: string;
    startDate: Date;
    endDate: Date;
    estimatedCost: number;
    status: 'REQUESTED' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
    linkedExpenseReportId?: string;
}

const tripsDB = new Map<string, Trip>();

export class TravelEngine {
    
    /**
     * Request travel
     */
    static async requestTravel(tenantId: string, employeeId: string, data: Omit<Trip, 'id' | 'tenantId' | 'employeeId' | 'status'>): Promise<Trip> {
        const tripId = `trip_${Date.now()}`;
        
        // Ensure estimatedCost is provided, do not invent
        if (data.estimatedCost === undefined || data.estimatedCost < 0) {
            throw new Error('Estimated cost must be provided based on actual supplied data.');
        }

        const trip: Trip = {
            ...data,
            id: tripId,
            tenantId,
            employeeId,
            status: 'REQUESTED',
        };

        tripsDB.set(tripId, trip);
        
        // EventRegistry.publish('travel.requested', trip);

        return trip;
    }

    /**
     * Approve travel and optionally create a linked expense report shell
     */
    static async approveTravel(tripId: string, actorId: string): Promise<Trip> {
        const trip = tripsDB.get(tripId);
        if (!trip) throw new Error('Trip not found');
        if (trip.status !== 'REQUESTED') throw new Error('Trip must be REQUESTED to be approved');

        trip.status = 'APPROVED';
        
        // EventRegistry.publish('travel.approved', { trip, actorId });
        
        return trip;
    }
}
