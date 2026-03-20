import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  files: ['src/**/*.spec.js'],
  nodeResolve: true,
  browsers: [playwrightLauncher({ product: 'chromium' })],
  testFramework: {
    config: {
      timeout: 5000,
    },
  },
};
