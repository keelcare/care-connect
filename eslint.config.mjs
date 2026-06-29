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
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // logger.ts itself is allowed to call console.*
    'src/lib/logger.ts',
  ]),
]);

export default eslintConfig;
