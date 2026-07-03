import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Enforce use of the gated logger (src/lib/logger.ts) instead of raw console calls.
      // Raw console.* leaks PII and internal state to the browser in production.
      'no-console': 'error',
    },
  },
  {
    // Build scripts and tests run in Node/CI, never ship to the browser, so
    // console output there is intentional.
    files: ['scripts/**', 'tests/**', '*.config.{js,mjs,cjs,ts}'],
    rules: {
      'no-console': 'off',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Native platform projects bundle the compiled web output plus generated
    // native sources — linting them produces thousands of false positives.
    'android/**',
    'ios/**',
    // logger.ts itself is allowed to call console.*
    'src/lib/logger.ts',
  ]),
]);

export default eslintConfig;
