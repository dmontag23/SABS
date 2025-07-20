// This file was created following https://reactnavigation.org/docs/typescript/#specifying-default-types-for-usenavigation-link-ref-etc
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { StackScreenProps } from "@react-navigation/stack";

import { TodayTixShow } from "./shows";
import { TodayTixShowtime } from "./showtimes";

export type RushShowStackParamList = {
  RushShowList: undefined;
  ShowDetails: { show: TodayTixShow; showtimes: TodayTixShowtime[] };
};

export type LoggedInBottomTabParamList = {
  RushShows: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  LoggedIn: undefined;
  EnterTokens: undefined;
};

export type RushShowsStackScreenProps<T extends keyof RushShowStackParamList> =
  StackScreenProps<RushShowStackParamList, T>;

export type LoggedInBottomTabScreenProps<
  T extends keyof LoggedInBottomTabParamList
> = BottomTabScreenProps<LoggedInBottomTabParamList, T>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
    interface LoggedInParamList extends LoggedInBottomTabParamList {}
    interface RushShowsParamList extends RushShowStackParamList {}
  }
}
