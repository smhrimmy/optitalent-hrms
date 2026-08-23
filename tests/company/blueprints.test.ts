import { describe, it, expect } from 'vitest';
import { getBlueprint } from '../../src/lib/company/blueprints';
import { moduleRegistry } from '../../src/lib/modules/registry';

describe('Company Blueprints & Module Registry', () => {

    it('resolves manufacturing blueprint defaults', () => {
        const bp = getBlueprint('Manufacturing');
        expect(bp).toBeDefined();
        expect(bp?.recommendedModules).toContain('shift_management');
        expect(bp?.recommendedWorkforceTypes).toContain('Contractor');
    });

    it('safely resolves dependencies when modules are activated', () => {
        // Assume 'shift_management' requires 'attendance' which requires 'core_hr'
        const requested = ['shift_management'];
        const resolved = moduleRegistry.resolveDependencies(requested);
        
        expect(resolved).toContain('shift_management');
        expect(resolved).toContain('attendance');
        expect(resolved).toContain('core_hr');
    });

    it('aggregates navigation routes based on active modules', () => {
        const activeModules = ['core_hr', 'attendance'];
        const routes = moduleRegistry.getEnabledRoutes(activeModules);
        
        expect(routes).toContain('/employees');
        expect(routes).toContain('/attendance');
        expect(routes).not.toContain('/shifts'); // Because shift_management isn't active
    });
});
