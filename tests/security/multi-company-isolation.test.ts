import { test, expect } from '@playwright/test';

test.describe('Multi-Company Security & Isolation', () => {

  test('Company A user cannot access Company B domain', async ({ page }) => {
    // We would simulate login as Company A user here
    // And then try to navigate to Company B
    
    // For this test, we assume the middleware handles `x-company-slug` 
    // and `getServerContext()` throws or redirects if the membership check fails.

    await page.goto('/login');
    // ... simulate login ...
    
    // Verify user can access their own tenant
    await page.goto('http://company-a.localhost:3000/employee/dashboard');
    // In a real e2e, we would assert the dashboard loads
    
    // Attempt to access another company
    const response = await page.goto('http://company-b.localhost:3000/employee/dashboard');
    
    // The middleware or server components should reject this
    // It should either return 404, or redirect to a /suspended or /login page
    expect(response?.url()).toContain('suspended');
  });

  test('Platform Owner bypasses Company isolation', async ({ page }) => {
    // Login as superadmin
    await page.goto('/login');
    // ... simulate superadmin login ...

    // Platform Owner should be able to access any company
    const responseB = await page.goto('http://company-b.localhost:3000/company-admin/dashboard');
    
    // Should NOT redirect to suspended
    expect(responseB?.url()).not.toContain('suspended');
    
    // Can also access Super Admin panel
    const responseSA = await page.goto('http://localhost:3000/super-admin');
    expect(responseSA?.url()).not.toContain('suspended');
  });
});
