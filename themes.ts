import {
  MD3DarkTheme,
  MD3LightTheme,
  configureFonts
} from "react-native-paper";

export const hadestownLightThemeColors = {
  primary: "rgb(192, 0, 21)",
  onPrimary: "rgb(255, 255, 255)",
  primaryContainer: "rgb(255, 218, 214)",
  onPrimaryContainer: "rgb(65, 0, 2)",
  secondary: "rgb(112, 93, 0)",
  onSecondary: "rgb(255, 255, 255)",
  secondaryContainer: "rgb(255, 225, 110)",
  onSecondaryContainer: "rgb(34, 27, 0)",
  tertiary: "rgb(129, 86, 0)",
  onTertiary: "rgb(255, 255, 255)",
  tertiaryContainer: "rgb(255, 221, 177)",
  onTertiaryContainer: "rgb(41, 24, 0)",
  error: "rgb(186, 26, 26)",
  onError: "rgb(255, 255, 255)",
  errorContainer: "rgb(255, 218, 214)",
  onErrorContainer: "rgb(65, 0, 2)",
  background: "rgb(255, 251, 255)",
  onBackground: "rgb(32, 26, 25)",
  surface: "rgb(255, 251, 255)",
  onSurface: "rgb(32, 26, 25)",
  surfaceVariant: "rgb(245, 221, 219)",
  onSurfaceVariant: "rgb(83, 67, 65)",
  outline: "rgb(133, 115, 113)",
  outlineVariant: "rgb(216, 194, 191)",
  shadow: "rgb(0, 0, 0)",
  scrim: "rgb(0, 0, 0)",
  inverseSurface: "rgb(54, 47, 46)",
  inverseOnSurface: "rgb(251, 238, 236)",
  inversePrimary: "rgb(255, 180, 172)",
  elevation: {
    level0: "transparent",
    level1: "rgb(252, 238, 243)",
    level2: "rgb(250, 231, 236)",
    level3: "rgb(248, 223, 229)",
    level4: "rgb(247, 221, 227)",
    level5: "rgb(246, 216, 222)"
  },
  surfaceDisabled: "rgba(32, 26, 25, 0.12)",
  onSurfaceDisabled: "rgba(32, 26, 25, 0.38)",
  backdrop: "rgba(59, 45, 44, 0.4)"
};

export const hadestownDarkThemeColors = {
  primary: "rgb(255, 180, 172)",
  onPrimary: "rgb(105, 0, 6)",
  primaryContainer: "rgb(147, 0, 13)",
  onPrimaryContainer: "rgb(255, 218, 214)",
  secondary: "rgb(227, 197, 74)",
  onSecondary: "rgb(58, 48, 0)",
  secondaryContainer: "rgb(84, 70, 0)",
  onSecondaryContainer: "rgb(255, 225, 110)",
  tertiary: "rgb(255, 186, 75)",
  onTertiary: "rgb(68, 43, 0)",
  tertiaryContainer: "rgb(98, 64, 0)",
  onTertiaryContainer: "rgb(255, 221, 177)",
  error: "rgb(255, 180, 171)",
  onError: "rgb(105, 0, 5)",
  errorContainer: "rgb(147, 0, 10)",
  onErrorContainer: "rgb(255, 180, 171)",
  background: "rgb(32, 26, 25)",
  onBackground: "rgb(237, 224, 222)",
  surface: "rgb(32, 26, 25)",
  onSurface: "rgb(237, 224, 222)",
  surfaceVariant: "rgb(83, 67, 65)",
  onSurfaceVariant: "rgb(216, 194, 191)",
  outline: "rgb(160, 140, 138)",
  outlineVariant: "rgb(83, 67, 65)",
  shadow: "rgb(0, 0, 0)",
  scrim: "rgb(0, 0, 0)",
  inverseSurface: "rgb(237, 224, 222)",
  inverseOnSurface: "rgb(54, 47, 46)",
  inversePrimary: "rgb(192, 0, 21)",
  elevation: {
    level0: "transparent",
    level1: "rgb(43, 34, 32)",
    level2: "rgb(50, 38, 37)",
    level3: "rgb(57, 43, 41)",
    level4: "rgb(59, 45, 43)",
    level5: "rgb(63, 48, 46)"
  },
  surfaceDisabled: "rgba(237, 224, 222, 0.12)",
  onSurfaceDisabled: "rgba(237, 224, 222, 0.38)",
  backdrop: "rgba(59, 45, 43, 0.4)"
};

const fontConfig = {
  fontFamily: "Chalkboard SE"
};

export const LIGHT_THEME = {
  ...MD3LightTheme,
  colors: hadestownLightThemeColors,
  fonts: configureFonts({ config: fontConfig })
};

export const DARK_THEME = {
  ...MD3DarkTheme,
  colors: hadestownDarkThemeColors,
  fonts: configureFonts({ config: fontConfig })
};
