import { CurrencyCode } from './currency';

export type CountryCode = 'US' | 'IN' | 'UK' | 'SG' | 'AE' | 'AU' | 'CA';

export interface LegalEntity {
    id: string;
    name: string;
    country: CountryCode;
    baseCurrency: CurrencyCode;
    taxIdentificationNumber: string;
    parentEntityId?: string; // Links back to the Global Organization
}

export const GlobalEntities: Record<string, LegalEntity> = {
    'OPT-GLOBAL': {
        id: 'OPT-GLOBAL',
        name: 'OptiTalent Global Holdings',
        country: 'US', // Headquartered in US
        baseCurrency: 'USD',
        taxIdentificationNumber: 'US-999999999'
    },
    'OPT-INDIA': {
        id: 'OPT-INDIA',
        name: 'OptiTalent India Pvt Ltd',
        country: 'IN',
        baseCurrency: 'INR',
        taxIdentificationNumber: 'IN-ABCDE1234F',
        parentEntityId: 'OPT-GLOBAL'
    },
    'OPT-UK': {
        id: 'OPT-UK',
        name: 'OptiTalent UK Ltd',
        country: 'UK',
        baseCurrency: 'GBP',
        taxIdentificationNumber: 'GB-123456789',
        parentEntityId: 'OPT-GLOBAL'
    }
};

export interface GlobalEmployeeContext {
    employeeId: string;
    entityId: string;
    country: CountryCode;
    employmentType: 'FULL_TIME' | 'CONTRACTOR';
    isExpat: boolean;
}
