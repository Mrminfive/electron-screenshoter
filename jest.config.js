module.exports = {
  projects: [
    {
      preset: 'ts-jest',
      runner: '@jest-runner/electron',
      testEnvironment: '@jest-runner/electron/environment',
      testRegex: '/__tests__/renderer/.*\\.(spec|test).ts$'
    },
    {
      preset: 'ts-jest',
      runner: '@jest-runner/electron/main',
      testEnvironment: 'node',
      testRegex: '/__tests__/(main|other)/.*\\.(spec|test).ts$'
    }
  ],
  collectCoverageFrom: ['src/**']
};
