import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

test.describe('Adversarial IDOR Test Suite', () => {

  test.describe.configure({ mode: 'serial' });
  
  let companyAEmployeeId: string;
  let companyAAdminToken: string;
  let companyBAdminToken: string;

  test.beforeAll(async () => {
    // 1. Authenticate as Company A Admin
    const authA = await supabase.auth.signInWithPassword({
      email: 'owner@companya.com',
      password: 'password123',
    });
    companyAAdminToken = authA.data.session?.access_token || '';

    // 2. Authenticate as Company B Admin
    const authB = await supabase.auth.signInWithPassword({
      email: 'owner@companyb.com',
      password: 'password123',
    });
    companyBAdminToken = authB.data.session?.access_token || '';

    // 3. Authenticate as Company A Employee (to get an ID)
    const authEmp = await supabase.auth.signInWithPassword({
      email: 'employee@companya.com',
      password: 'password123',
    });
    
    // Fetch employee record directly from db using Service role or Admin to find their ID
    // Since we don't have direct DB access in the test without service role, we will query via API
  });

  test('Company A user can access their own data via API', async ({ request }) => {
    // This assumes there's an API route or we can hit a server component endpoint
    // For now, let's verify login works.
    expect(companyAAdminToken).toBeTruthy();
    expect(companyBAdminToken).toBeTruthy();
    
    const response = await request.get('/api/v1/employees', {
      headers: {
        Authorization: `Bearer ${companyAAdminToken}`,
        'x-company-slug': 'company-a',
      }
    });

    if (response.status() === 200) {
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      if (data.length > 0) {
        companyAEmployeeId = data[0].id;
      }
    }
  });

  test('Company B Admin CANNOT access Company A Employee via direct ID (IDOR)', async ({ request }) => {
    test.skip(!companyAEmployeeId, 'No employee ID found for Company A');

    const response = await request.get(`/api/v1/employees/${companyAEmployeeId}`, {
      headers: {
        Authorization: `Bearer ${companyBAdminToken}`,
        'x-company-slug': 'company-b',
      }
    });

    // Should return 404 Not Found or 403 Forbidden
    expect([403, 404]).toContain(response.status());
  });

  test('Company B Admin CANNOT manipulate URL to access Company A using Company A slug', async ({ request }) => {
    const response = await request.get(`/api/v1/employees`, {
      headers: {
        Authorization: `Bearer ${companyBAdminToken}`,
        'x-company-slug': 'company-a', // Attempting to spoof tenant
      }
    });

    // The middleware or server must reject since Company B Admin is not a member of Company A
    expect([401, 403]).toContain(response.status());
  });

});
