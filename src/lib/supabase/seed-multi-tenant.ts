
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { Database } from '../../database.types';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: '.env' });

// Disable SSL verification for development/testing if needed (Fixes "fetch failed" on some networks/self-signed certs)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials in .env');
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: { 'Authorization': `Bearer ${supabaseServiceKey}` },
    fetch: fetch as any // Force node-fetch v2
  }
});

async function main() {
  console.log('🌱 Starting Multi-Tenant Database Seeding...');

  try {
    // 1. CLEANUP
    console.log('🧹 Cleaning up existing data...');
    await cleanupData();

    // 2. CREATE TENANTS
    console.log('🏢 Creating Tenants...');
    const tenants = await seedTenants();

    // 3. CREATE DEPARTMENTS PER TENANT
    console.log('📂 Creating Departments...');
    await seedDepartments(tenants);

    // 4. CREATE USERS & EMPLOYEES
    console.log('👥 Creating Users & Employees...');
    const employees = await seedUsersAndEmployees(tenants);

    // 5. SEED OPERATIONAL DATA
    console.log('📊 Seeding Operational Data...');
    await seedOperationalData(tenants, employees);

    console.log('✅ Seeding Complete!');
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
}

async function cleanupData() {
  console.log('   - Clearing existing data...');
  // Order matters due to foreign key constraints
  const tables = [
    'bonus_points_history', 'assessment_attempts', 'assessments', 
    'payroll_history', 'performance_reviews', 'company_feed_posts', 
    'helpdesk_messages', 'helpdesk_tickets', 'leave_requests', 
    'holidays', 'leave_balances', 'interview_notes', 'applicants', 
    'job_openings', 'employees', 'users', 'departments'
    // Do NOT clear tenants to keep IDs stable if possible, or handle carefully
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
        // Ignore "table not found" errors or foreign key violations if order is imperfect
        console.warn(`   - Warning clearing ${table}:`, error.message);
    }
  }
}

async function seedTenants() {
  const tenantData = [
    { name: 'OptiTalent HQ', slug: 'optitalent', plan: 'Enterprise', status: 'Active' },
    { name: 'Acme Corp', slug: 'acme', plan: 'Startup', status: 'Active' },
    { name: 'Globex Inc', slug: 'globex', plan: 'Free', status: 'Active' }
  ];

  // Upsert tenants to avoid duplicate key errors
  const { data, error } = await supabase.from('tenants').upsert(tenantData, { onConflict: 'slug' }).select();
  if (error) throw error;
  return data;
}

async function seedDepartments(tenants: any[]) {
  const departments = ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance'];
  const inserts = [];

  for (const tenant of tenants) {
    for (const deptName of departments) {
      inserts.push({
        tenant_id: tenant.id,
        name: deptName,
        description: `${deptName} department for ${tenant.name}`
      });
    }
  }
  
  const { error } = await supabase.from('departments').insert(inserts);
  if (error) throw error;
}

async function seedUsersAndEmployees(tenants: any[]) {
  const allEmployees = [];

  for (const tenant of tenants) {
    // Get departments for this tenant
    const { data: tenantDepts } = await supabase.from('departments').select('id, name').eq('tenant_id', tenant.id);
    if (!tenantDepts) continue;

    // Create Admin for Tenant
    const adminEmail = `admin@${tenant.slug}.com`;
    const adminUser = await createAuthUser(adminEmail, 'Admin User', 'admin', tenant.id);
    if (adminUser) {
        const adminEmp = await createEmployeeProfile(supabase, tenant.id, adminUser.id, tenantDepts[0].id, 'CEO', 'ADM001');
        allEmployees.push(adminEmp);
    }

    // Create HR User
    const hrEmail = `hr@${tenant.slug}.com`;
    const hrUser = await createAuthUser(hrEmail, 'HR Manager', 'hr', tenant.id);
    if (hrUser) {
        const hrEmp = await createEmployeeProfile(supabase, tenant.id, hrUser.id, tenantDepts[1].id, 'HR Manager', 'HR001');
        allEmployees.push(hrEmp);
    }

    // Create Manager User
    const managerEmail = `manager@${tenant.slug}.com`;
    const managerUser = await createAuthUser(managerEmail, 'Team Lead', 'manager', tenant.id);
    if (managerUser) {
        const managerEmp = await createEmployeeProfile(supabase, tenant.id, managerUser.id, tenantDepts[0].id, 'Team Lead', 'MGR001');
        allEmployees.push(managerEmp);
    }

    // Create Users for ALL roles to facilitate testing
    const roles = [
      { email: `recruiter@${tenant.slug}.com`, name: 'Recruiter User', role: 'recruiter', title: 'Senior Recruiter', code: 'REC' },
      { email: `trainer@${tenant.slug}.com`, name: 'Trainer User', role: 'trainer', title: 'Training Specialist', code: 'TRN' },
      { email: `qa@${tenant.slug}.com`, name: 'QA Analyst', role: 'qa-analyst', title: 'QA Engineer', code: 'QAA' },
      { email: `process@${tenant.slug}.com`, name: 'Process Manager', role: 'process-manager', title: 'Process Lead', code: 'PRO' },
      { email: `teamlead@${tenant.slug}.com`, name: 'Team Leader', role: 'team-leader', title: 'Team Lead', code: 'TEA' },
      { email: `marketing@${tenant.slug}.com`, name: 'Marketing User', role: 'marketing', title: 'Marketing Specialist', code: 'MKT' },
      { email: `finance@${tenant.slug}.com`, name: 'Finance User', role: 'finance', title: 'Accountant', code: 'FIN' },
      { email: `it@${tenant.slug}.com`, name: 'IT Manager', role: 'it-manager', title: 'IT Head', code: 'ITM' },
      { email: `ops@${tenant.slug}.com`, name: 'Ops Manager', role: 'operations-manager', title: 'Operations Lead', code: 'OPS' },
      { email: `account@${tenant.slug}.com`, name: 'Account Manager', role: 'account-manager', title: 'Account Executive', code: 'ACT' },
      { email: `trainee@${tenant.slug}.com`, name: 'Trainee User', role: 'trainee', title: 'Graduate Trainee', code: 'TRE' }
    ];

    for (const r of roles) {
        const user = await createAuthUser(r.email, r.name, r.role, tenant.id);
        if (user) {
            const emp = await createEmployeeProfile(supabase, tenant.id, user.id, tenantDepts[0].id, r.title, `${r.code}001`);
            allEmployees.push(emp);
        }
    }

    // Create 5 Employees per Tenant
    for (let i = 1; i <= 5; i++) {
      const email = `employee${i}@${tenant.slug}.com`;
      const dept = tenantDepts[i % tenantDepts.length];
      const user = await createAuthUser(email, faker.person.fullName(), 'employee', tenant.id);
      
      if (user) {
        const emp = await createEmployeeProfile(supabase, tenant.id, user.id, dept.id, faker.person.jobTitle(), `EMP${String(i).padStart(3, '0')}`);
        allEmployees.push(emp);
      }
    }
  }
  return allEmployees;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function createAuthUser(email: string, fullName: string, role: string, tenantId: string, retries = 3) {
  // Check if user exists first to avoid error
  for (let attempt = 1; attempt <= retries; attempt++) {
      try {
          const { data: { users } } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
          const existing = users.find(u => u.email === email);
          
          if (existing) {
              // Update metadata if needed
              await supabase.auth.admin.updateUserById(existing.id, {
                  user_metadata: { full_name: fullName, tenant_id: tenantId },
                  password: 'password123', // Force reset password on existing users too
                  email_confirm: true
              });
              // Ensure public.users record is correct
              await supabase.from('users').upsert({
                  id: existing.id,
                  email: email,
                  full_name: fullName,
                  role: role as any,
                  tenant_id: tenantId
              });
              return existing;
          }

          const { data, error } = await supabase.auth.admin.createUser({
            email,
            password: 'password123',
            email_confirm: true,
            user_metadata: { full_name: fullName, tenant_id: tenantId }
          });

          if (error) throw error;
          
          // Trigger handles public.users creation, but we update role manually to be safe
          await supabase.from('users').update({ role: role as any }).eq('id', data.user.id);
          
          return data.user;
      } catch (error: any) {
          // Handle specific errors that imply user exists
          if (error.message?.includes("Database error creating new user") || error.status === 422 || error.message?.includes("already been registered")) {
               console.log(`   - User ${email} exists (caught error). Fetching...`);
               const { data: { users } } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
               const existing = users.find(u => u.email === email);
               if (existing) {
                   // Ensure public.users record is correct
                   await supabase.from('users').upsert({
                      id: existing.id,
                      email: email,
                      full_name: fullName,
                      role: role as any,
                      tenant_id: tenantId
                   });
                   return existing;
               }
          }
          
          if (attempt === retries) {
              console.error(`Failed to create/update user ${email} after ${retries} attempts:`, error.message);
              return null;
          }
          await delay(1000 * attempt); // Exponential backoffish
      }
  }
  return null;
}

async function createEmployeeProfile(supabase: any, tenantId: string, userId: string, deptId: string, title: string, empId: string) {
  // First ensure public.users record exists to satisfy FK constraint
  // Sometimes the trigger is slow or fails, so we upsert here to be safe
  const { error: userError } = await supabase.from('users').upsert({
      id: userId,
      tenant_id: tenantId,
      // We don't have email/name here easily, but if record exists it updates tenant_id
      // If it doesn't exist, we might fail on not-null constraints if we don't provide them.
      // Ideally, the createAuthUser function already handled this.
  }, { onConflict: 'id', ignoreDuplicates: true }); 

  const { data, error } = await supabase.from('employees').insert({
    tenant_id: tenantId,
    user_id: userId,
    department_id: deptId,
    job_title: title,
    employee_id: empId,
    status: 'Active',
    hire_date: faker.date.past().toISOString(),
    phone_number: faker.phone.number(),
    profile_picture_url: faker.image.avatar()
  }).select().single();

  if (error) {
      // Handle unique constraint violation on employee_id or user_id gracefully
      if (error.code === '23505') { // Unique violation
          console.log(`   - Employee profile for ${empId} already exists.`);
          return null;
      }
      console.error(`   - Error creating employee ${empId}:`, error.message);
      return null;
  }
  return data;
}

async function seedOperationalData(tenants: any[], employees: any[]) {
  // Filter out nulls
  const validEmployees = employees.filter(e => e !== null);

  for (const emp of validEmployees) {
      // 1. Leave Balances
      await supabase.from('leave_balances').insert({
          tenant_id: emp.tenant_id,
          employee_id: emp.id,
          sick_leave: 10,
          casual_leave: 12,
          paid_time_off: 20
      });

      // 2. Leave Requests (Random)
      if (Math.random() > 0.5) {
          await supabase.from('leave_requests').insert({
              tenant_id: emp.tenant_id,
              employee_id: emp.id,
              leave_type: 'Sick Leave',
              start_date: new Date().toISOString(),
              end_date: new Date().toISOString(),
              reason: 'Feeling unwell',
              status: 'Pending'
          });
      }

      // 3. Helpdesk Tickets
      if (Math.random() > 0.7) {
          await supabase.from('helpdesk_tickets').insert({
              tenant_id: emp.tenant_id,
              employee_id: emp.id,
              subject: 'Laptop Issue',
              description: 'My screen is flickering',
              category: 'IT Support',
              priority: 'High',
              status: 'Open'
          });
      }
  }
}

main();
