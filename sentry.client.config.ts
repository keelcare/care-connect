import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
  ],

  // 100% traces at launch — every slow transaction is visible.
  // Reduce to 0.2 once traffic grows and Sentry quota becomes a concern.
  tracesSampleRate: 1.0,

  // Replay 50% of sessions — enough to diagnose most UX issues at launch.
  replaysSessionSampleRate: 0.5,

  // Always capture a replay when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
