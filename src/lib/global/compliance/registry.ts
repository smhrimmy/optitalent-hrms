import { CountryCode } from '../entity';

export interface ComplianceObligation {
    id: string;
    title: string;
    country: CountryCode;
    targetAudience: 'ALL' | 'MANAGERS' | 'CONTRACTORS';
    renewalFrequencyDays: number;
    requiresDocumentUpload: boolean;
}

export const GlobalComplianceRegistry: Record<string, ComplianceObligation> = {
    'US-I9': {
        id: 'US-I9',
        title: 'Form I-9 Employment Eligibility Verification',
        country: 'US',
        targetAudience: 'ALL',
        renewalFrequencyDays: 1095, // Usually every 3 years for re-verification if applicable
        requiresDocumentUpload: true
    },
    'US-SEXUAL-HARASSMENT-TRAINING': {
        id: 'US-SEXUAL-HARASSMENT-TRAINING',
        title: 'Statutory Sexual Harassment Prevention Training (CA/NY)',
        country: 'US',
        targetAudience: 'ALL',
        renewalFrequencyDays: 365,
        requiresDocumentUpload: false
    },
    'IN-PF-NOMINATION': {
        id: 'IN-PF-NOMINATION',
        title: 'EPF Form 2 (Nomination and Declaration)',
        country: 'IN',
        targetAudience: 'ALL',
        renewalFrequencyDays: 0, // One-time at joining, unless family changes
        requiresDocumentUpload: true
    },
    'IN-POSH-TRAINING': {
        id: 'IN-POSH-TRAINING',
        title: 'Prevention of Sexual Harassment (POSH) Awareness',
        country: 'IN',
        targetAudience: 'ALL',
        renewalFrequencyDays: 365,
        requiresDocumentUpload: false
    }
};
