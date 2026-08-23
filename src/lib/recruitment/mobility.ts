import { JobRequisition } from './types';

/**
 * Interface representing a matched internal employee.
 */
export interface InternalMatch {
    employeeId: string;
    firstName: string;
    lastName: string;
    currentRole: string;
    matchedSkills: string[];
    matchScore: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class InternalMobilityEngine {
    
    /**
     * Recommends existing employees for a new requisition by querying the Digital Twin (Skills Engine).
     */
    async findInternalCandidates(requisition: JobRequisition): Promise<InternalMatch[]> {
        // Mock query to the Digital Twin's Skills Engine
        // In a real system, this searches the Employee Graph for overlapping skills.
        
        console.log(`Querying Digital Twin for Internal Mobility matches for Req: ${requisition.title}`);
        
        // Mock Response
        const matches: InternalMatch[] = [];

        if (requisition.requiredSkills.includes('Node.js')) {
            matches.push({
                employeeId: 'EMP-089',
                firstName: 'Priya',
                lastName: 'Sharma',
                currentRole: 'Backend Engineer II',
                matchedSkills: ['Node.js', 'PostgreSQL', 'AWS'],
                matchScore: 'HIGH'
            });
        }

        return matches;
    }
}

export const mobilityEngine = new InternalMobilityEngine();
