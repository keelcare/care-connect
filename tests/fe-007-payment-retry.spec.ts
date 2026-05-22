/**
 * FE-007 — Payment Failure has no Retry CTA
 *
 * Verifies that the "Retry Payment" button is rendered on the booking detail
 * page whenever:
 *   (a) booking.payment_status === 'failed', OR
 *   (b) booking has no payment_status but is in an active status (CONFIRMED /
 *       PENDING / ASSIGNED / ACCEPTED) and a nanny is assigned.
 *
 * Also verifies that clicking the button fires POST /payments/retry/:bookingId.
 */

import { test, expect, Route } from '@playwright/test';

const BACKEND = 'http://localhost:4000';
const BOOKING_ID = 'booking-fe007-test';

/** Minimal user shape returned by /users/me */
const MOCK_USER = {
  id: 'parent-001',
  email: 'parent@test.com',
  role: 'PARENT',
  is_verified: true,
  profiles: {
    first_name: 'Test',
    last_name: 'Parent',
    address: '123 Main St',
    phone: '9999999999',
  },
};

/** Helper — create a mock booking fixture */
function mockBooking(overrides: Record<string, unknown> = {}) {
  return {
    id: BOOKING_ID,
    job_id: 'job-001',
    parent_id: 'parent-001',
    nanny_id: 'nanny-001',
    status: 'CONFIRMED',
    payment_status: 'failed',
    start_time: new Date(Date.now() + 86_400_000).toISOString(), // tomorrow
    end_time: new Date(Date.now() + 86_400_000 + 4 * 3_600_000).toISOString(),
    total_amount: 1200,
    hourly_rate: 300,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    nanny: {
      id: 'nanny-001',
      email: 'nanny@test.com',
      role: 'NANNY',
      is_verified: true,
      profiles: { first_name: 'Jane', last_name: 'Doe', address: 'Delhi' },
      nanny_details: { bio: 'Experienced nanny', hourly_rate: 300, experience_years: 5 },
      totalReviews: 12,
    },
    ...overrides,
  };
}

/** Intercept all backend requests needed for the booking detail page.
 *  Uses glob patterns so the match is URL-structure-based and is not
 *  sensitive to protocol/port variations between environments.
 */
async function setupMocks(
  page: import('@playwright/test').Page,
  bookingOverrides: Record<string, unknown> = {}
) {
  // Inject localStorage flags so AuthContext doesn't short-circuit and so
  // the "paid" state from previous sessions doesn't bleed in.
  await page.addInitScript((userId: string) => {
    localStorage.setItem('has_session', 'true');
    localStorage.removeItem('paidBookingIds');
  }, MOCK_USER.id);

  // Auth: /users/me (called by AuthContext when has_session is set)
  await page.route('**/users/me', (route: Route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER) })
  );

  // Auth token refresh — return 200 silently
  await page.route('**/auth/refresh', (route: Route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  );

  // Booking detail — must be registered before the catch-all bookings route
  await page.route(`**/${BOOKING_ID}`, (route: Route) => {
    // Only intercept the booking detail endpoint, not unrelated routes
    if (route.request().url().includes('/bookings/')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBooking(bookingOverrides)),
      });
    }
    return route.continue();
  });

  // Service requests — 404 so ClientPage doesn't fall through to request mode
  await page.route('**/requests/**', (route: Route) =>
    route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ message: 'Not found' }) })
  );

  // SSE and notifications — return empty/no-op responses to avoid hanging
  await page.route('**/sse', (route: Route) => route.abort());
  await page.route('**/notifications**', (route: Route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  );
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

test.describe('FE-007 · Payment Failure Retry CTA', () => {
  test('shows "Retry Payment" button when payment_status is failed', async ({ page }) => {
    await setupMocks(page, { payment_status: 'failed', status: 'CONFIRMED' });

    await page.goto(`/bookings/${BOOKING_ID}`);

    const retryBtn = page.getByRole('button', { name: /retry payment/i });
    await expect(retryBtn).toBeVisible({ timeout: 10_000 });
  });

  test('shows "Retry Payment" button for CONFIRMED booking with no payment_status', async ({ page }) => {
    // Simulates a booking that was never paid (payment_status absent)
    await setupMocks(page, { payment_status: undefined, status: 'CONFIRMED' });

    await page.goto(`/bookings/${BOOKING_ID}`);

    const retryBtn = page.getByRole('button', { name: /retry payment/i });
    await expect(retryBtn).toBeVisible({ timeout: 10_000 });
  });

  test('shows "Retry Payment" button for PENDING booking with no payment_status', async ({ page }) => {
    await setupMocks(page, { payment_status: undefined, status: 'PENDING' });

    await page.goto(`/bookings/${BOOKING_ID}`);

    await expect(page.getByRole('button', { name: /retry payment/i })).toBeVisible({ timeout: 10_000 });
  });

  test('does NOT show "Retry Payment" button when payment_status is paid', async ({ page }) => {
    await setupMocks(page, { payment_status: 'paid', status: 'CONFIRMED' });

    // Mark booking as paid in localStorage
    await page.addInitScript((id: string) => {
      localStorage.setItem('paidBookingIds', JSON.stringify([id]));
    }, BOOKING_ID);

    await page.goto(`/bookings/${BOOKING_ID}`);

    // Wait for the page to finish loading (nanny card or booking date visible)
    await expect(page.getByText(/Jane Doe/i)).toBeVisible({ timeout: 10_000 });

    await expect(page.getByRole('button', { name: /retry payment/i })).not.toBeVisible();
  });

  test('does NOT show "Retry Payment" button for COMPLETED bookings', async ({ page }) => {
    await setupMocks(page, { payment_status: 'paid', status: 'COMPLETED' });

    await page.addInitScript((id: string) => {
      localStorage.setItem('paidBookingIds', JSON.stringify([id]));
    }, BOOKING_ID);

    await page.goto(`/bookings/${BOOKING_ID}`);

    await expect(page.getByText(/Jane Doe/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: /retry payment/i })).not.toBeVisible();
  });

  test('clicking "Retry Payment" calls POST /payments/retry/:bookingId', async ({ page }) => {
    await setupMocks(page, { payment_status: 'failed', status: 'CONFIRMED' });

    // Track calls to the retry endpoint
    let retryCalled = false;
    await page.route(`**/payments/retry/${BOOKING_ID}`, (route: Route) => {
      if (route.request().method() === 'POST') retryCalled = true;
      // Return a mock order — Razorpay SDK is not loaded in test env so the
      // handler will throw, but the API call itself is what we verify.
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          orderId: 'order_test123',
          amount: 120000,
          currency: 'INR',
          key: 'rzp_test_key',
        }),
      });
    });

    await page.goto(`/bookings/${BOOKING_ID}`);

    const retryBtn = page.getByRole('button', { name: /retry payment/i });
    await expect(retryBtn).toBeVisible({ timeout: 10_000 });
    await retryBtn.click();

    // Give the async handler time to fire
    await page.waitForTimeout(1500);

    expect(retryCalled).toBe(true);
  });
});
