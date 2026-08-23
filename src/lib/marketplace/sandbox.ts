import { InstalledExtension } from './lifecycle';

export class ExtensionSecurityException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ExtensionSecurityException';
    }
}

export class ExtensionSandbox {
    
    /**
     * Intercepts an API call or action originating from an installed Marketplace Extension.
     * Enforces that the extension only accesses scopes it was explicitly granted during installation.
     */
    static async executeInSandbox(
        installation: InstalledExtension, 
        requestedActionScope: string, 
        actionPayload: any
    ) {
        // 1. Check if the extension is ACTIVE
        if (installation.state !== 'ACTIVE') {
            throw new ExtensionSecurityException(`Cannot execute action. Extension state is: ${installation.state}`);
        }

        // 2. Validate Scopes (The core sandbox barrier)
        if (!installation.grantedPermissions.includes(requestedActionScope)) {
            console.error(`[Sandbox Violation] Extension ${installation.extensionId} attempted unauthorized access to ${requestedActionScope}`);
            throw new ExtensionSecurityException(`Sandbox Violation: Extension is not authorized for scope '${requestedActionScope}'.`);
        }

        // 3. Execution (Mock)
        console.log(`[Sandbox] Authorized execution of ${requestedActionScope} for Extension ${installation.extensionId}`);
        
        return {
            status: 'SUCCESS',
            sandbox_note: 'Action executed securely within granted scopes.'
        };
    }
}
