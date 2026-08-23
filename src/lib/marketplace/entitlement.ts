import { ExtensionManifest } from './manifest';

export type CompanySubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface CompanySubscription {
    companyId: string;
    tier: CompanySubscriptionTier;
    isActive: boolean;
}

export class EntitlementException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EntitlementException';
    }
}

export class EntitlementEngine {
    // MOCK Subscription Data
    private static mockSubscriptions: Record<string, CompanySubscription> = {
        'TENANT-1': { companyId: 'TENANT-1', tier: 'PRO', isActive: true },
        'TENANT-2': { companyId: 'TENANT-2', tier: 'FREE', isActive: true },
    };

    /**
     * Checks if a company is commercially entitled to install and run an extension.
     */
    static checkEntitlement(companyId: string, extension: ExtensionManifest): boolean {
        const sub = this.mockSubscriptions[companyId];
        
        if (!sub || !sub.isActive) {
            throw new EntitlementException(`Company ${companyId} does not have an active subscription.`);
        }

        if (extension.isPremium) {
            if (extension.tier === 'ENTERPRISE' && sub.tier !== 'ENTERPRISE') {
                throw new EntitlementException(`Extension ${extension.id} requires an ENTERPRISE subscription. Current tier: ${sub.tier}.`);
            }
            if (extension.tier === 'PRO' && sub.tier === 'FREE') {
                throw new EntitlementException(`Extension ${extension.id} requires a PRO subscription. Current tier: ${sub.tier}.`);
            }
        }

        return true;
    }
}
