import { test, expect } from '@playwright/test';

test.describe('Application Smoke Tests', () => {
  
  test('Home page loads successfully', async ({ page }) => {
    await page.goto('/');
    // Check for a key element on the home page (e.g., CTA or Hero text)
    // We look for a "Get Started" or similar button, or just ensure the body is visible
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveTitle(/CareConnect|Home/i);
  });

  test('Browse page loads', async ({ page }) => {
    await page.goto('/browse');
    await expect(page.locator('body')).toBeVisible();
    // Verify the URL is correct
    await expect(page).toHaveURL(/.*browse/);
  });

  test('Login page loads', async ({ page }) => {
    await page.goto('/auth/login');
    // Check for login form fields using placeholders since labels aren't strictly associated
    await expect(page.getByPlaceholder(/enter your email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/••••••••/i)).toBeVisible();
  });

});
