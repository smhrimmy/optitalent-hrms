import { test, expect } from '@playwright/test';

test.describe('HR Command Center Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email address').fill('hr@optitalent.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL(/\/hr\/dashboard/);

    // Explicitly navigate to the command center (since postLogin path goes to dashboard)
    await page.goto('/hr');
  });

  test('HR Admin can view executive metrics and drill down', async ({ page }) => {
    // Assert dashboard loaded
    await expect(page.getByRole('heading', { name: 'Executive Overview' })).toBeVisible();
    
    // Check that KPIs render
    await expect(page.getByText('Total Headcount')).toBeVisible();
    await expect(page.getByText('Turnover Rate')).toBeVisible();

    // Click to operations
    await page.getByRole('link', { name: 'View Operations' }).click();
    await expect(page).toHaveURL(/\/hr\/operations/, { timeout: 15000 });
  });

  test('HR Admin must explicitly confirm sensitive policy exceptions', async ({ page }) => {
    await page.goto('/hr/operations');

    // Assume there is a pending exception to approve
    const approveButton = page.getByRole('button', { name: /Approve/ }).first();
    await approveButton.click();

    // Verify confirmation modal opens
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('You are about to approve this request.')).toBeVisible();

    // Click confirm
    const confirmButton = dialog.getByRole('button', { name: 'Confirm Approval' });
    await confirmButton.click();

    // Check loading state
    await expect(dialog.getByRole('button', { name: 'Processing...' })).toBeVisible();

    // Wait for resolution
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });
});
