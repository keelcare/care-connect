import { test, expect } from '@playwright/test';

test.describe('Application Smoke Tests', () => {

  test('Home page loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveTitle(/Keel/i);
  });

  test('Browse page loads', async ({ page }) => {
    await page.goto('/browse');
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/.*browse/);
    await expect(page).toHaveTitle(/Browse Caregivers | Keel/i);
  });

  test('Login page loads', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page).toHaveTitle(/Sign In | Keel/i);
    await expect(page.getByPlaceholder(/enter your email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/••••••••/i)).toBeVisible();
  });

  test('Sign up page loads', async ({ page }) => {
    await page.goto('/auth/signup');
    await expect(page).toHaveTitle(/Create an Account | Keel/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('404 page loads for unknown route', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist-xyz');
    expect(response?.status()).toBe(404);
  });

});
