import { IntegrationMapping } from './types';

export class MappingEngine {
    
    /**
     * Transforms an OptiTalent payload into the external system's format
     * based on the tenant's configured IntegrationMapping.
     */
    static applyMapping(payload: any, mapping: IntegrationMapping): any {
        if (!mapping || !mapping.fieldMappings || mapping.fieldMappings.length === 0) {
            return payload; // No mapping defined, return original
        }

        const transformed: any = {};

        for (const rule of mapping.fieldMappings) {
            const internalValue = this.getNestedValue(payload, rule.internalField);
            
            if (internalValue !== undefined) {
                let finalValue = internalValue;
                
                // Apply optional transformations
                if (rule.transform === 'UPPERCASE') {
                    finalValue = String(finalValue).toUpperCase();
                } else if (rule.transform === 'LOWERCASE') {
                    finalValue = String(finalValue).toLowerCase();
                } else if (rule.transform === 'DATE_ISO' && finalValue instanceof Date) {
                    finalValue = finalValue.toISOString();
                } else if (rule.transform === 'DATE_YYYYMMDD' && finalValue instanceof Date) {
                    finalValue = finalValue.toISOString().split('T')[0];
                }

                this.setNestedValue(transformed, rule.externalField, finalValue);
            }
        }

        return transformed;
    }

    /**
     * Helper to safely extract nested object properties (e.g., 'profile.firstName')
     */
    private static getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    /**
     * Helper to safely set nested object properties
     */
    private static setNestedValue(obj: any, path: string, value: any) {
        const parts = path.split('.');
        const last = parts.pop();
        if (!last) return;
        
        const target = parts.reduce((acc, part) => {
            if (!acc[part]) acc[part] = {};
            return acc[part];
        }, obj);
        
        target[last] = value;
    }
}
