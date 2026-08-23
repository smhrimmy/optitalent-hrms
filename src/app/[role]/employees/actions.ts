
'use server';

import { autoAssignRoles, type AutoAssignRolesInput, type AutoAssignRolesOutput } from "@/ai/flows/auto-assign-roles";
import { getCompanyContext } from '@/lib/auth-server';
import { authorize } from '@/lib/authorization/engine';

export async function suggestRoleAction(input: AutoAssignRolesInput): Promise<AutoAssignRolesOutput> {
    const context = await getCompanyContext();
    if (!context) throw new Error("Unauthorized");
    
    const authResult = authorize({ context, resource: 'ai', action: 'run' });
    if (!authResult.allowed) throw new Error("Forbidden");

    return await autoAssignRoles(input);
}

export async function addEmployeeAction(formData: FormData): Promise<{success: boolean, message?: string}> {
    const context = await getCompanyContext();
    if (!context) throw new Error("Unauthorized");
    
    const authResult = authorize({ context, resource: 'employee', action: 'create' });
    if (!authResult.allowed) throw new Error("Forbidden");

    console.log("Mock Action: Adding employee with data:", Object.fromEntries(formData));
    // In a real app, this would interact with a database and auth provider.
    // For this mock, the data is added directly in the client component for immediate feedback.
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}

import { EmployeeRepository } from '@/lib/repository/employee-repository';
import { UserProfile } from '@/lib/mock-data/employees';

export async function getEmployeesAction(): Promise<UserProfile[]> {
    const context = await getCompanyContext();
    if (!context) throw new Error("Unauthorized");
    
    const authResult = authorize({ context, resource: 'employee', action: 'read' });
    if (!authResult.allowed) throw new Error("Forbidden");

    const repo = new EmployeeRepository(context);
    const employees = await repo.findAll();

    return employees.map((e: any) => ({
        id: e.id,
        full_name: e.users?.full_name || 'Unknown',
        department: { name: e.departments?.name || 'Unassigned' },
        department_id: e.department_id || '',
        job_title: e.job_title,
        role: e.users?.role || 'employee',
        employee_id: e.employee_id,
        email: e.users?.email,
        profile_picture_url: e.profile_picture_url,
        phone_number: e.phone_number,
        status: e.status as 'Active' | 'Inactive',
        hire_date: e.hire_date
    }));
}
