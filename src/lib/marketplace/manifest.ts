export type ExtensionType = 'APP' | 'MODULE' | 'INDUSTRY_PACK' | 'WORKFLOW_PACK' | 'POLICY_PACK' | 'AI_AGENT';

export interface ExtensionManifest {
    id: string;
    version: string;
    name: string;
    publisher: string;
    type: ExtensionType;
    description: string;
    
    // Authorization & Security
    requiredPermissions: string[]; // e.g. ['employee.read', 'payroll.read']
    eventSubscriptions: string[];  // e.g. ['employee.created', 'leave.approved']
    
    // Dependencies & Compatibility
    requiredModules: string[];
    supportedCountries: string[]; // e.g. ['US', 'IN'] or ['ALL']
    
    // Commercial
    isPremium: boolean;
    tier: 'FREE' | 'PRO' | 'ENTERPRISE';
}
