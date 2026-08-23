import { ExtensionRegistry } from './registry';
import { EntitlementEngine } from './entitlement';

export type InstallationState = 'DISCOVER' | 'REVIEW' | 'INSTALLED' | 'ACTIVE' | 'SUSPENDED' | 'ERROR';

export interface InstalledExtension {
    installationId: string;
    companyId: string;
    extensionId: string;
    version: string;
    state: InstallationState;
    grantedPermissions: string[];
    installedAt: Date;
}

export class ExtensionLifecycleManager {
    // MOCK Database of installed extensions
    private static installedExtensions: InstalledExtension[] = [
        {
            installationId: 'INST-1',
            companyId: 'TENANT-1',
            extensionId: 'ext-slack-notifier',
            version: '2.1.0',
            state: 'ACTIVE',
            grantedPermissions: ['notifications.send'],
            installedAt: new Date()
        }
    ];

    /**
     * Initiates the installation of an extension for a company.
     */
    static installExtension(companyId: string, extensionId: string, adminApprovedPermissions: string[]): InstalledExtension {
        const extension = ExtensionRegistry.getExtension(extensionId);
        if (!extension) throw new Error('Extension not found.');

        // 1. Check Commercial Entitlement
        EntitlementEngine.checkEntitlement(companyId, extension);

        // 2. Verify all required permissions were explicitly approved by the admin
        for (const reqPerm of extension.requiredPermissions) {
            if (!adminApprovedPermissions.includes(reqPerm)) {
                throw new Error(`Installation aborted. Admin did not approve required permission: ${reqPerm}`);
            }
        }

        // 3. Create Installation Record
        const installation: InstalledExtension = {
            installationId: `INST-${Math.floor(Math.random() * 10000)}`,
            companyId,
            extensionId,
            version: extension.version,
            state: 'ACTIVE',
            grantedPermissions: adminApprovedPermissions,
            installedAt: new Date()
        };

        this.installedExtensions.push(installation);
        
        console.log(`[Marketplace] Extension ${extensionId} successfully installed for Company ${companyId}`);
        return installation;
    }

    static getInstalledExtensions(companyId: string): InstalledExtension[] {
        return this.installedExtensions.filter(e => e.companyId === companyId);
    }
}
