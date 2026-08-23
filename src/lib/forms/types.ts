export type FieldType = 'text' | 'number' | 'currency' | 'date' | 'select' | 'multi-select' | 'boolean' | 'file';

export interface CustomField {
    id: string;
    name: string;
    label: string;
    type: FieldType;
    required: boolean;
    options?: string[]; // For select/multi-select
    scope?: string; // e.g. role required to view/edit this field
}

export interface FormSection {
    id: string;
    title: string;
    fields: CustomField[];
    order: number;
}
