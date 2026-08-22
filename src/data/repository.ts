/**
 * Local data provider. UI should import `repo`, not poke dataquery collections.
 * Swap this file later for a Supabase/REST adapter with the same shape.
 */
import { dataQuery } from '@/lib/dataquery';
import { TENANT_ID } from '@/engines/dna';

export const repo = {
  tenantId: TENANT_ID,
  company: () => dataQuery.getCompany(),
  employees: () => dataQuery.listEmployees(),
  stats: () => dataQuery.dashboardStats(),
  clock: (employeeId: string) => dataQuery.clock(employeeId),
  addEmployee: dataQuery.addEmployee.bind(dataQuery),
  applyLeave: dataQuery.applyLeave.bind(dataQuery),
  updateLeaveStatus: dataQuery.updateLeaveStatus.bind(dataQuery),
};
