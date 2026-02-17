module.exports = {
  presets: ["module:@react-native/babel-preset"],
  /* The following is needed for react-native-dotenv and react-native-reanimated. The reanimated plugin must be listed last!
  See https://github.com/goatandsheep/react-native-dotenv and https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started */
  plugins: [
    "@babel/plugin-transform-export-namespace-from",
    "module:react-native-dotenv",
    "react-native-worklets/plugin"
  ],
  /** The following is needed for react native paper.
   *  See https://callstack.github.io/react-native-paper/docs/guides/getting-started
   */
  env: {
    production: {
      plugins: ["react-native-paper/babel"]
    }
  }
};
