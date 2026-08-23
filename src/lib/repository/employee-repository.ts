import { BaseRepository, BaseRepositoryOptions } from './base-repository';
import { supabase } from '../supabase';

export interface Employee {
  id: string;
  company_id: string;
  membership_id: string | null;
  department_id: string | null;
  job_title: string;
  employee_id: string;
  status: string;
  // ... other fields
}

export class EmployeeRepository extends BaseRepository<Employee> {
  constructor() {
    super('employees');
  }

  // Example of a specialized query that still respects company boundaries
  async listByDepartment(departmentId: string, options: BaseRepositoryOptions) {
    const { data, error } = await this.getQuery(options).eq('department_id', departmentId);
    if (error) throw error;
    return data as Employee[];
  }

  async create(employeeData: Partial<Employee>, options: BaseRepositoryOptions) {
    // Automatically inject company_id for safety
    const safeData = {
      ...employeeData,
      company_id: options.context.companyId
    };

    const client = options.client || supabase;
    const { data, error } = await client.from(this.tableName).insert(safeData).select().single();
    if (error) throw error;
    return data as Employee;
  }
}

export const employeeRepository = new EmployeeRepository();
