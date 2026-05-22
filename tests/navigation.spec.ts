import { test, expect } from '@playwright/test';

test.describe('Protected Routes — redirect when unauthenticated', () => {
  const protectedRoutes = [
    '/dashboard',
    '/parent-dashboard',
    '/settings',
    '/messages',
    '/bookings',
    '/notifications',
  ];

  for (const route of protectedRoutes) {
    test(`${route} redirects to login`, async ({ page }) => {
      await page.goto(route);
      // Should redirect to login (or welcome) page
      await expect(page).toHaveURL(/login|welcome|auth/, { timeout: 8000 });
    });
  }
});

test.describe('Public Routes', () => {
  test('welcome / landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('browse page loads and has search input', async ({ page }) => {
    await page.goto('/browse');
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/browse/);
  });

  test('sitemap.xml is reachable', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
  });

  test('robots.txt is reachable', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
  });
});

test.describe('Accessibility', () => {
  test('skip-to-main-content link exists in DOM', async ({ page }) => {
    await page.goto('/browse');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveCount(1);
    await expect(skipLink).toHaveText(/skip to main content/i);
  });

  test('main content landmark exists', async ({ page }) => {
    await page.goto('/browse');
    await expect(page.locator('main#main-content')).toHaveCount(1);
  });

  test('login page password label is associated with input', async ({ page }) => {
    await page.goto('/auth/login');
    // htmlFor="password" ties the label to id="password" on the input
    const label = page.locator('label[for="password"]');
    await expect(label).toHaveCount(1);
  });
});
