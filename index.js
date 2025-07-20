/* react-native-gesture-handler needs to be the first import
See https://reactnavigation.org/docs/stack-navigator/ */
import { AppRegistry } from "react-native";

import "react-native-gesture-handler";

import App from "./App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
