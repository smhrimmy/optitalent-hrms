import { ApiKey, OAuthClient } from './types';
// import { PermissionService } from '../security/permissions';

export class IntegrationAuthService {
    
    /**
     * Validates an API Key or Bearer token and returns the resolved company and scopes.
     * In a real app, this would check against a DB cache and verify hashes.
     */
    static async authenticateRequest(authHeader: string | null, clientIp: string): Promise<{ companyId: string, scopes: string[] }> {
        if (!authHeader) {
            throw new Error('Missing Authorization header');
        }

        // Mock: Accept a static bearer token for testing
        if (authHeader.startsWith('Bearer opti_')) {
            const token = authHeader.replace('Bearer ', '');
            
            // Mock DB lookup
            if (token === 'opti_test_key_123') {
                const mockKey: ApiKey = {
                    id: 'key_1',
                    companyId: 'company_optitalent', // Migrated from companyId
                    name: 'Test ERP Integration',
                    keyHash: 'hash',
                    scopes: ['employees:read', 'payroll:write'],
                    status: 'ACTIVE',
                    createdAt: new Date(),
                    createdBy: 'admin'
                };

                // IP Restriction Check
                if (mockKey.ipRestrictions && mockKey.ipRestrictions.length > 0) {
                    if (!mockKey.ipRestrictions.includes(clientIp)) {
                        throw new Error('IP address not authorized');
                    }
                }

                return {
                    companyId: mockKey.companyId,
                    scopes: mockKey.scopes
                };
            }
        }

        throw new Error('Invalid or expired token');
    }

    /**
     * Enforces that the authenticated token has the required scope before proceeding.
     */
    static requireScope(grantedScopes: string[], requiredScope: string) {
        if (!grantedScopes.includes(requiredScope) && !grantedScopes.includes('admin:all')) {
            throw new Error(`Forbidden: Requires scope ${requiredScope}`);
        }
    }
}
