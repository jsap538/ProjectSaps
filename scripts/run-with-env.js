#!/usr/bin/env node

/**
 * Secure script runner that loads environment variables from .env.local
 * Usage: node scripts/run-with-env.js scripts/populate-items.mjs
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found');
    console.error('Please create .env.local with your MongoDB credentials');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};

  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  return envVars;
}

// Main execution
function main() {
  const scriptPath = process.argv[2];
  
  if (!scriptPath) {
    console.error('❌ Usage: node scripts/run-with-env.js <script-path>');
    console.error('Example: node scripts/run-with-env.js scripts/populate-items.mjs');
    process.exit(1);
  }

  if (!fs.existsSync(scriptPath)) {
    console.error(`❌ Script not found: ${scriptPath}`);
    process.exit(1);
  }

  console.log('🔐 Loading environment variables from .env.local...');
  const envVars = loadEnvFile();

  // Merge with existing environment
  const env = { ...process.env, ...envVars };

  console.log(`🚀 Running script: ${scriptPath}`);
  
  const child = spawn('node', [scriptPath], {
    env,
    stdio: 'inherit',
    cwd: process.cwd()
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Script completed successfully');
    } else {
      console.log(`❌ Script failed with exit code ${code}`);
      process.exit(code);
    }
  });

  child.on('error', (error) => {
    console.error('❌ Failed to start script:', error);
    process.exit(1);
  });
}

main();
