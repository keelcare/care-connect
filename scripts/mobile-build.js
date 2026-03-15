const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Load the mobile env file
const envPath = path.join(__dirname, '../.env.mobile');
const envContent = fs.readFileSync(envPath, 'utf8');

// 2. Parse variables (ignore comments and empty lines)
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...values] = trimmed.split('=');
    if (key && values) {
      envVars[key.trim()] = values.join('=').trim();
    }
  }
});

console.log('🚀 Starting Mobile Build with injected environment...');
console.log(`📍 API Target: ${envVars.NEXT_PUBLIC_API_URL}`);

// 3. Run next build with the injected env
const result = spawnSync('npx', ['next', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ...envVars,
    BUILD_TARGET: 'capacitor'
  },
  shell: true
});

if (result.status !== 0) {
  process.exit(result.status);
}
