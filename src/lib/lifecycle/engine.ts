import { EmployeeState } from './types';

export class LifecycleEngine {
    
    // Allowed state transitions based on Company DNA rules
    private validTransitions: Record<EmployeeState, EmployeeState[]> = {
        'APPLICANT': ['OFFERED'],
        'OFFERED': ['PREBOARDING', 'APPLICANT'], // e.g. offer rescinded
        'PREBOARDING': ['ONBOARDING', 'OFFERED'],
        'ONBOARDING': ['PROBATION', 'ACTIVE', 'TERMINATED'],
        'PROBATION': ['ACTIVE', 'TERMINATED'],
        'ACTIVE': ['PROMOTION_PENDING', 'TRANSFER_PENDING', 'ON_LEAVE', 'SUSPENDED', 'EXIT_PENDING', 'TERMINATED'],
        'ON_LEAVE': ['ACTIVE', 'TERMINATED'],
        'SUSPENDED': ['ACTIVE', 'TERMINATED'],
        'PROMOTION_PENDING': ['ACTIVE'],
        'TRANSFER_PENDING': ['ACTIVE'],
        'EXIT_PENDING': ['NOTICE_PERIOD', 'ACTIVE'], // e.g. resignation withdrawn
        'NOTICE_PERIOD': ['OFFBOARDING'],
        'OFFBOARDING': ['ALUMNI', 'TERMINATED', 'RETIRED'],
        'TERMINATED': [],
        'RETIRED': [],
        'ALUMNI': []
    };

    /**
     * Evaluates if an employee can move from their current state to a requested target state.
     */
    canTransition(currentState: EmployeeState, targetState: EmployeeState): boolean {
        const allowedTargets = this.validTransitions[currentState] || [];
        return allowedTargets.includes(targetState);
    }
}

export const lifecycleEngine = new LifecycleEngine();
