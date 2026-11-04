/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts', // keeps these files away from vitest (*.spec.ts)
  fullyParallel: true,
  retries: process.env['CI'] ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  // builds and starts the ssr server unless one is already running on 4000
  webServer: {
    command: 'npm run serve:ssr:local',
    url: 'http://localhost:4000/healthz',
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
