import { FormSection } from './types';
import { CompanyDNA } from '../company/types';
import { getBlueprint } from '../company/blueprints';

export class FormEngine {
    
    /**
     * Generates a dynamic form layout by merging Core HR fields with 
     * Industry-specific extensions and tenant custom fields.
     */
    generateEmployeeForm(dna: CompanyDNA): FormSection[] {
        const sections: FormSection[] = [
            {
                id: 'personal',
                title: 'Personal Information',
                order: 1,
                fields: [
                    { id: 'firstName', name: 'firstName', label: 'First Name', type: 'text', required: true },
                    { id: 'lastName', name: 'lastName', label: 'Last Name', type: 'text', required: true },
                    { id: 'email', name: 'email', label: 'Work Email', type: 'text', required: true }
                ]
            },
            {
                id: 'employment',
                title: 'Employment Details',
                order: 2,
                fields: [
                    { id: 'department', name: 'department', label: 'Department', type: 'select', required: true },
                    { id: 'manager', name: 'manager', label: 'Manager', type: 'select', required: false }
                ]
            }
        ];

        // 2. Add industry-specific extensions
        const bp = getBlueprint(dna.industry);
        if (bp && bp.recommendedFields.length > 0) {
            const industrySection: FormSection = {
                id: `ext_${dna.industry.toLowerCase()}`,
                title: `${dna.industry} Information`,
                order: 3,
                fields: bp.recommendedFields.map(f => ({
                    id: f,
                    name: f,
                    label: this.formatLabel(f),
                    type: 'text',
                    required: false
                }))
            };
            sections.push(industrySection);
        }

        // 3. (Future) Add tenant custom fields here...

        return sections.sort((a, b) => a.order - b.order);
    }

    private formatLabel(str: string): string {
        return str
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
    }
}

export const formEngine = new FormEngine();
