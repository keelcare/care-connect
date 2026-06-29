import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility tests using axe-core (WCAG 2.1 AA).
 * These run against public pages that don't require authentication.
 * Add authenticated-page tests once auth state helpers are in place.
 */

const PUBLIC_PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Browse caregivers', path: '/browse' },
  { name: 'Login', path: '/auth/login' },
  { name: 'Sign up', path: '/auth/signup' },
  { name: 'Forgot password', path: '/auth/forgot-password' },
  { name: 'Privacy policy', path: '/privacy' },
  { name: 'Terms of service', path: '/terms' },
];

for (const { name, path } of PUBLIC_PAGES) {
  test(`${name} has no critical a11y violations`, async ({ page }) => {
    await page.goto(path);
    // Wait for the page to settle before scanning
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      // Exclude third-party iframes (Razorpay, etc.)
      .exclude('iframe')
      .analyze();

    // Report violations clearly in test output
    if (results.violations.length > 0) {
      const summary = results.violations.map((v) =>
        `[${v.impact?.toUpperCase()}] ${v.id}: ${v.description}\n  Nodes: ${v.nodes.map((n) => n.target.join(', ')).join(' | ')}`
      ).join('\n\n');
      console.info(`\n=== A11y violations on ${path} ===\n${summary}\n`);
    }

    expect(
      results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious'),
      `Critical/serious a11y violations on ${path}`
    ).toHaveLength(0);
  });
}
