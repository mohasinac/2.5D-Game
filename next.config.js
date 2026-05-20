/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.next',
  // Disable app directory for now, use pages directory
  experimental: {
    appDir: true,
  },
  // Configure for running alongside Colyseus server
  env: {
    COLYSEUS_SERVER_URL: process.env.COLYSEUS_SERVER_URL || 'http://localhost:2567',
  },
  // Configure port for Next.js
  // Next.js will run on port 3001, Colyseus on 2567
  serverRuntimeConfig: {
    port: process.env.NEXT_PORT || 3001,
  },
  publicRuntimeConfig: {
    gameServerUrl: process.env.COLYSEUS_SERVER_URL || 'http://localhost:2567',
  },
}

module.exports = nextConfig
