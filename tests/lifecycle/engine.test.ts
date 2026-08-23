import { describe, it, expect } from 'vitest';
import { lifecycleEngine } from '../../src/lib/lifecycle/engine';

describe('Lifecycle State Machine', () => {

    it('allows valid transitions', () => {
        expect(lifecycleEngine.canTransition('ACTIVE', 'PROMOTION_PENDING')).toBe(true);
        expect(lifecycleEngine.canTransition('ONBOARDING', 'ACTIVE')).toBe(true);
    });

    it('blocks invalid transitions', () => {
        // You cannot go from Alumni back to Probation
        expect(lifecycleEngine.canTransition('ALUMNI', 'PROBATION')).toBe(false);
        // You cannot skip to Terminated without going through the defined paths
        expect(lifecycleEngine.canTransition('PREBOARDING', 'TERMINATED')).toBe(false);
    });
});
