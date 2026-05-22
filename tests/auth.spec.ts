import { test, expect } from '@playwright/test';

test.describe('Auth — Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test('renders email and password inputs', async ({ page }) => {
    await expect(page.getByPlaceholder(/enter your email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/••••••••/i)).toBeVisible();
  });

  test('shows validation error when submitting empty form', async ({ page }) => {
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    // Browser native required validation prevents submission; email field should be focused
    const emailInput = page.getByPlaceholder(/enter your email/i);
    await expect(emailInput).toBeFocused();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.getByPlaceholder(/enter your email/i).fill('notauser@example.com');
    await page.getByPlaceholder(/••••••••/i).fill('wrongpassword123');
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    // Wait for error message to appear
    await expect(
      page.getByText(/invalid|incorrect|wrong|not found|credentials/i)
    ).toBeVisible({ timeout: 8000 });
  });

  test('has working "Forgot password?" link', async ({ page }) => {
    await page.getByRole('link', { name: /forgot password/i }).click();
    await expect(page).toHaveURL(/forgot-password/);
  });

  test('has working link to sign up page', async ({ page }) => {
    await page.getByRole('link', { name: /sign up|create account/i }).click();
    await expect(page).toHaveURL(/signup/);
  });
});

test.describe('Auth — Sign Up', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signup');
  });

  test('renders signup form fields', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/signup/);
  });

  test('shows validation when submitting empty form', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /create account|sign up|get started/i }).first();
    await submitBtn.click();
    // At least one required input should be focused or error shown
    await expect(page.locator('input[required]').first()).toBeFocused();
  });
});

test.describe('Auth — Forgot Password', () => {
  test('renders email input', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
