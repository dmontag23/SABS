const {getDefaultConfig, mergeConfig} = require("@react-native/metro-config");

const {
  wrapWithReanimatedMetroConfig
} = require("react-native-reanimated/metro-config");

const {withSentryConfig} = require("@sentry/react-native/metro");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {resetCache: true};

module.exports = withSentryConfig(
  wrapWithReanimatedMetroConfig(
    mergeConfig(getDefaultConfig(__dirname), config)
  )
);
