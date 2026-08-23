export interface ModuleDefinition {
    id: string;
    name: string;
    description: string;
    category: 'Core' | 'Workforce' | 'Operations' | 'Finance' | 'Talent';
    dependencies: string[]; // IDs of other modules required to enable this one
    routes: string[]; // Sidebar navigation routes associated with this module
}

export class ModuleRegistry {
    private modules: Map<string, ModuleDefinition> = new Map();

    constructor() {
        this.registerDefaultModules();
    }

    private registerDefaultModules() {
        this.register({
            id: 'core_hr',
            name: 'Core HR',
            description: 'Essential employee records and organization management.',
            category: 'Core',
            dependencies: [],
            routes: ['/employees', '/organization']
        });

        this.register({
            id: 'attendance',
            name: 'Attendance',
            description: 'Track employee time and attendance.',
            category: 'Workforce',
            dependencies: ['core_hr'],
            routes: ['/attendance']
        });

        this.register({
            id: 'shift_management',
            name: 'Shift Management',
            description: 'Manage complex shift schedules.',
            category: 'Operations',
            dependencies: ['attendance'],
            routes: ['/shifts']
        });
        
        this.register({
            id: 'overtime',
            name: 'Overtime',
            description: 'Manage overtime requests and rules.',
            category: 'Workforce',
            dependencies: ['attendance'],
            routes: ['/overtime']
        });

        this.register({
            id: 'payroll',
            name: 'Payroll',
            description: 'Calculate and process employee compensation.',
            category: 'Finance',
            dependencies: ['core_hr'],
            routes: ['/payroll']
        });

        this.register({
            id: 'plant_management',
            name: 'Plant Management',
            description: 'Manage manufacturing plants and lines.',
            category: 'Operations',
            dependencies: ['core_hr'],
            routes: ['/plants']
        });
    }

    register(moduleDef: ModuleDefinition) {
        this.modules.set(moduleDef.id, moduleDef);
    }

    getModule(id: string): ModuleDefinition | undefined {
        return this.modules.get(id);
    }

    getAllModules(): ModuleDefinition[] {
        return Array.from(this.modules.values());
    }

    /**
     * Given a list of requested module IDs, returns a safe list ensuring all dependencies are met.
     */
    resolveDependencies(requestedModuleIds: string[]): string[] {
        const resolved = new Set<string>();
        
        const addModule = (id: string) => {
            if (resolved.has(id)) return;
            const mod = this.modules.get(id);
            if (!mod) return; // Skip unknown modules

            // Resolve dependencies first
            for (const dep of mod.dependencies) {
                addModule(dep);
            }
            resolved.add(id);
        };

        for (const id of requestedModuleIds) {
            addModule(id);
        }

        return Array.from(resolved);
    }

    /**
     * Returns the aggregated list of UI navigation routes for the enabled modules.
     */
    getEnabledRoutes(enabledModuleIds: string[]): string[] {
        const routes = new Set<string>();
        for (const id of enabledModuleIds) {
            const mod = this.modules.get(id);
            if (mod) {
                mod.routes.forEach(r => routes.add(r));
            }
        }
        return Array.from(routes);
    }
}

export const moduleRegistry = new ModuleRegistry();
