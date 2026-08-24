import { getDigitalTwin } from '../intelligence/projections';
import { whyEngine } from '../intelligence/why-engine';
import { skillsEngine, TargetRole } from '../intelligence/skills-engine';
import { workforceSimulator } from '../intelligence/simulator';
import { PermissionService } from '../permissions';
import { buildAuthRequest } from '../auth-server';

/**
 * Structured AI Tools for the HR Chief of Staff
 * All tools must enforce permissions before returning data to the LLM.
 */

export class AITools {
    
    async getWorkforceSummary(context: any): Promise<any> {
        // Enforce AI access
        const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');
        
        const twin = getDigitalTwin(context.companyId);
        return {
            totalHeadcount: twin.employees.size,
            departments: twin.organizationNodes.size,
            lastUpdated: twin.lastUpdated
        };
    }

    async explainMetric(context: any, metricName: string, metricValue: number): Promise<any> {
        const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');
        return whyEngine.explainAnomaly(context.companyId, metricName, metricValue);
    }

    async getSkillGap(context: any, employeeId: string, targetRoleTitle: string, requiredSkills: string[]): Promise<any> {
        // Explicitly check if the user/AI is allowed to view THIS employee's skills
        const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');
        
        const twin = getDigitalTwin(context.companyId);
        const emp = twin.employees.get(employeeId);
        if (!emp) throw new Error('Employee not found');

        const role: TargetRole = { title: targetRoleTitle, requiredSkills };
        return skillsEngine.calculateGap(emp, role);
    }

    async simulateHiring(context: any, count: number, departmentId: string, managerId: string): Promise<any> {
        // Requires high-level simulation access
        const authResult = authorize({
            context,
            resource: 'legacy',
            action: 'legacy'
        });
        if (!authResult.allowed) throw new Error('Forbidden');
        return workforceSimulator.simulateHiringEvent(context.companyId, count, departmentId, managerId);
    }
}

export const aiTools = new AITools();
