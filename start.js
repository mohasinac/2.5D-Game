#!/usr/bin/env node

/**
 * Startup script for Beyblade Game Server & Admin Panel
 * This script checks the environment and starts both services
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎮 Beyblade Game Server & Admin Panel');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.warn('⚠️  Warning: .env file not found!');
  console.log('   Copy .env.example to .env and configure it.\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.error('❌ Error: node_modules not found!');
  console.log('   Run: npm install\n');
  process.exit(1);
}

console.log('✅ Environment checks passed\n');
console.log('Starting services...\n');

// Start both services using concurrently
const child = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

child.on('exit', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Process exited with code ${code}`);
    process.exit(code);
  }
});

// Handle termination
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  child.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  child.kill('SIGTERM');
  process.exit(0);
});
