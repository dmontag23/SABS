/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: "react-native",
  rootDir: "../../..",
  testMatch: ["<rootDir>/tests/e2e/**/*.test.ts"],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: "detox/runners/jest/globalSetup",
  globalTeardown: "detox/runners/jest/globalTeardown",
  reporters: ["detox/runners/jest/reporter"],
  setupFilesAfterEnv: ["<rootDir>/tests/e2e/utils/setup.ts"],
  testEnvironment: "detox/runners/jest/testEnvironment",
  verbose: true
};
