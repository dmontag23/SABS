module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!mock-server/**",
    "!**/tests/**",
    "!**/types/**",
    "!App.tsx"
  ],
  globalSetup: "<rootDir>/tests/integration/globalSetup.ts",
  moduleNameMapper: {
    /* added the line below to resolve absolute imports from the root directory,
    e.g. for all the custom react testing library functions
    see https://testing-library.com/docs/react-testing-library/setup/#configuring-jest-with-test-utils */
    "testing-library/extension": "<rootDir>/tests/integration/utils"
  },
  preset: "react-native",
  setupFilesAfterEnv: ["<rootDir>/tests/integration/setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/tests/e2e"],
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native|react-native|@react-navigation|react-native-vector-icons|react-native-reanimated|react-native-worklets|react-native-gesture-handler)/)"
  ]
};
