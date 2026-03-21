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

console.log('🚀 Starting Mobile Sync with injected environment...');

const customEnv = {
    ...process.env,
    ...envVars,
    BUILD_TARGET: 'capacitor'
};

if (envVars.NEXT_PUBLIC_API_URL) {
    console.log(`📍 API Target: ${envVars.NEXT_PUBLIC_API_URL}`);
}

if (envVars.CAP_FRONTEND_URL) {
    console.log(`🌍 Remote Frontend URL detected: ${envVars.CAP_FRONTEND_URL}`);
    console.log(`⏭️  Skipping Next.js local bundle build. The mobile app will load this URL directly!`);
} else {
    console.log(`📦 Building local Next.js frontend (this takes a few moments)...`);
    // 3. Run next build with the injected env
    const buildResult = spawnSync('npx', ['next', 'build'], {
      stdio: 'inherit',
      env: customEnv,
      shell: true
    });
    
    if (buildResult.status !== 0) {
      process.exit(buildResult.status);
    }
}

console.log(`🔄 Syncing Capacitor native files...`);
// 4. Run cap sync with variables to inject URL into android/ios configurations!
const syncResult = spawnSync('npx', ['cap', 'sync'], {
    stdio: 'inherit',
    env: customEnv,
    shell: true
});
  
if (syncResult.status !== 0) {
    process.exit(syncResult.status);
}

console.log(`✅ Sync Complete.`);
