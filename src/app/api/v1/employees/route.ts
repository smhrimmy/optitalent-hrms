import { NextRequest, NextResponse } from 'next/server';
import { IntegrationAuthService } from '@/lib/integration/auth';
import { MappingEngine } from '@/lib/integration/mapping-engine';
import { IntegrationMapping } from '@/lib/integration/types';

export async function GET(request: NextRequest) {
    try {
        // 1. Authenticate Request
        const authHeader = request.headers.get('Authorization');
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        
        const { companyId, scopes } = await IntegrationAuthService.authenticateRequest(authHeader, ip);
        
        // 2. Authorize Scope
        IntegrationAuthService.requireScope(scopes, 'employees:read');

        // 3. Fetch Domain Data (Mocked)
        const mockEmployees = [
            { id: 'EMP-1', profile: { firstName: 'Alice', lastName: 'Smith' }, department: 'Engineering' },
            { id: 'EMP-2', profile: { firstName: 'Bob', lastName: 'Jones' }, department: 'Sales' }
        ];

        // 4. Apply Mapping (Mocked DB lookup for company mapping)
        // If the company had configured a mapping for this endpoint, apply it.
        const mockMapping: IntegrationMapping = {
            id: 'map_1',
            companyId,
            system: 'EXTERNAL_ERP',
            direction: 'OUTBOUND',
            entityType: 'Employee',
            fieldMappings: [
                { internalField: 'id', externalField: 'worker_id' },
                { internalField: 'profile.firstName', externalField: 'given_name', transform: 'UPPERCASE' },
                { internalField: 'profile.lastName', externalField: 'family_name', transform: 'UPPERCASE' }
            ]
        };

        const mappedResponse = mockEmployees.map(emp => MappingEngine.applyMapping(emp, mockMapping));

        // 5. Return JSON
        return NextResponse.json({
            data: mappedResponse,
            meta: { total: 2 }
        });

    } catch (error: any) {
        if (error.message.includes('Authorization') || error.message.includes('Invalid')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error.message.includes('Forbidden')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
