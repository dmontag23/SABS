import React, { useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";

import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import {
  QueryClient,
  QueryClientProvider,
  focusManager
} from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider, adaptNavigationTheme } from "react-native-paper";

import RootNavigator from "./components/screens/RootNavigator";
import { LIGHT_THEME } from "./themes";

Sentry.init({
  dsn: "https://d31580a48951a99064cb12260f4284e4@o4508338113150976.ingest.de.sentry.io/4508338121211984",
  maxBreadcrumbs: 400

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

const QUERY_CLIENT = new QueryClient();

const { LightTheme: NAV_LIGHT_THEME } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  materialLight: LIGHT_THEME
});

const App = () => {
  /* refetch any queries anytime the user leaves the app and then returns
  see https://tanstack.com/query/latest/docs/framework/react/guides/window-focus-refetching */
  const onAppStateChange = (status: AppStateStatus) => {
    if (Platform.OS !== "web") focusManager.setFocused(status === "active");
  };

  useEffect(() => {
    const { remove } = AppState.addEventListener("change", onAppStateChange);
    return remove;
  }, []);

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={QUERY_CLIENT}>
        <NavigationContainer
          /* TODO: Undo the spread operation here when react-native-paper's adaptNavigationTheme supports fonts
          https://github.com/callstack/react-native-paper/issues/4540 */
          theme={{ ...NAV_LIGHT_THEME, fonts: DefaultTheme.fonts }}
        >
          {/* PaperProvider should be the innermost provider for the app. See
          https://callstack.github.io/react-native-paper/docs/guides/getting-started */}
          <PaperProvider theme={LIGHT_THEME}>
            <RootNavigator />
          </PaperProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
