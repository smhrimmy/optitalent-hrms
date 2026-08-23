import { ExtensionManifest } from './manifest';

export class ExtensionRegistry {
    // MOCK Database of available extensions
    private static availableExtensions: ExtensionManifest[] = [
        {
            id: 'ext-slack-notifier',
            version: '2.1.0',
            name: 'Slack Notifications',
            publisher: 'OptiTalent Inc',
            type: 'APP',
            description: 'Send workflow approvals and lifecycle events to Slack channels.',
            requiredPermissions: ['notifications.send'],
            eventSubscriptions: ['leave.approved', 'employee.onboarded'],
            requiredModules: [],
            supportedCountries: ['ALL'],
            isPremium: false,
            tier: 'FREE'
        },
        {
            id: 'ext-mfg-pack',
            version: '1.0.0',
            name: 'Manufacturing Workforce Pack',
            publisher: 'OptiTalent Industry Solutions',
            type: 'INDUSTRY_PACK',
            description: 'Plant management, shift policies, and safety compliance workflows.',
            requiredPermissions: ['workforce.write', 'attendance.write', 'policies.manage'],
            eventSubscriptions: [],
            requiredModules: ['core-attendance'],
            supportedCountries: ['ALL'],
            isPremium: true,
            tier: 'ENTERPRISE'
        },
        {
            id: 'ext-ai-recruiter',
            version: '1.2.0',
            name: 'AI Recruiting Agent',
            publisher: 'OptiTalent Labs',
            type: 'AI_AGENT',
            description: 'Autonomous agent that reads recruitment pipelines and recommends candidates.',
            requiredPermissions: ['recruitment.read', 'skills.read'],
            eventSubscriptions: ['candidate.applied'],
            requiredModules: ['core-recruitment'],
            supportedCountries: ['ALL'],
            isPremium: true,
            tier: 'PRO'
        }
    ];

    static getCatalog(): ExtensionManifest[] {
        return this.availableExtensions;
    }

    static getExtension(id: string): ExtensionManifest | undefined {
        return this.availableExtensions.find(e => e.id === id);
    }
}
