/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: "jest",
      config: "tests/e2e/utils/jest.config.js"
    },
    jest: {
      setupTimeout: 120000
    }
  },
  apps: {
    "ios.debug": {
      type: "ios.app",
      binaryPath: "ios/build/Build/Products/Debug-iphonesimulator/rush.app",
      build:
        "xcodebuild -workspace ios/rush.xcworkspace -scheme rush -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build"
    },
    "ios.release": {
      type: "ios.app",
      binaryPath: "ios/build/Build/Products/Release-iphonesimulator/rush.app",
      build:
        "xcodebuild -workspace ios/rush.xcworkspace -scheme rush -configuration Release -sdk iphonesimulator -derivedDataPath ios/build"
    },
    "android.debug": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      build:
        "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug",
      reversePorts: [8081]
    },
    "android.release": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/release/app-release.apk",
      build:
        "cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release"
    }
  },
  artifacts: {
    rootDir: "tests/e2e/.artifacts/",
    plugins: {
      screenshot: "failing",
      video: "failing"
    }
  },
  devices: {
    iphone12: {
      type: "ios.simulator",
      device: {
        type: "iPhone 12"
      }
    },
    iphone15: {
      type: "ios.simulator",
      device: {
        type: "iPhone 15"
      }
    },
    attached: {
      type: "android.attached",
      device: {
        adbName: ".*"
      }
    },
    emulator: {
      type: "android.emulator",
      device: {
        avdName: "Pixel_3a_API_30_x86"
      }
    }
  },
  configurations: {
    "ios.sim.debug": {
      device: "iphone12",
      app: "ios.debug"
    },
    "ios.sim.release": {
      device: "iphone15",
      app: "ios.release"
    },
    "android.att.debug": {
      device: "attached",
      app: "android.debug"
    },
    "android.att.release": {
      device: "attached",
      app: "android.release"
    },
    "android.emu.debug": {
      device: "emulator",
      app: "android.debug"
    },
    "android.emu.release": {
      device: "emulator",
      app: "android.release"
    }
  }
};
