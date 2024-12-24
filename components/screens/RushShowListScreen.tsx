import React, {useMemo} from "react";
import {ScrollView, StyleSheet, View} from "react-native";

import {useSafeAreaInsets} from "react-native-safe-area-context";

import ShowCard, {isShowActive} from "../ShowCard";
import LoadingSpinner from "../ui/LoadingSpinner";

import useGetLocation from "../../hooks/asyncStorageHooks/useGetLocation";
import useGetShows from "../../hooks/todayTixHooks/useGetShows";
import useGetShowtimesWithRushAvailability from "../../hooks/todayTixHooks/useGetShowtimesWithRushAvailability";
import useGrantRushAccessForAllShows from "../../hooks/useGrantRushAccessForAllShows";
import {RushShowsStackScreenProps} from "../../types/navigation";
import {TodayTixFieldset, TodayTixShow} from "../../types/shows";
import {TodayTixShowtime} from "../../types/showtimes";

const isRushUnlocked = (show: TodayTixShow, allUnlockedRushShowIds: number[]) =>
  allUnlockedRushShowIds.includes(show.showId ?? NaN);

const addTickets = (showtimes: TodayTixShowtime[]) =>
  showtimes.reduce(
    (ticketCount, showtime) =>
      ticketCount + (showtime.rushTickets?.quantityAvailable ?? 0),
    0
  );

const RushShowListScreen = ({
  navigation
}: RushShowsStackScreenProps<"RushShowList">) => {
  const {top, bottom} = useSafeAreaInsets();

  const {data: location, isPending: isLoadingLocation} = useGetLocation();
  const {data: rushAndLotteryShows, isPending: isLoadingRushAndLotteryShows} =
    useGetShows({
      requestParams: {
        areAccessProgramsActive: true,
        fieldset: TodayTixFieldset.Summary,
        limit: 10000,
        location
      },
      enabled: Boolean(location)
    });

  const rushShows = useMemo(
    () => rushAndLotteryShows?.filter(show => show.isRushActive) ?? [],
    [rushAndLotteryShows]
  );

  const {isGrantingAccess, rushGrants} =
    useGrantRushAccessForAllShows(rushShows);

  const {data: rushShowtimes, isPending: isLoadingRushShowtimes} =
    useGetShowtimesWithRushAvailability({
      showIds: rushShows.map(show => show.id)
    });

  if (
    isLoadingLocation ||
    isLoadingRushAndLotteryShows ||
    isGrantingAccess ||
    isLoadingRushShowtimes
  )
    return (
      <View style={styles.loadingSpinnerContainer}>
        <LoadingSpinner size="large" />
      </View>
    );

  const allUnlockedRushShowIds = rushGrants.map(({showId}) => showId);
  const showsAndTimes = rushShows.map((show, i) => ({
    show,
    showtimes: rushShowtimes[i] ?? []
  }));

  const sortedRushShows = showsAndTimes.sort((a, b) => {
    const firstShowActiveNumber = isShowActive(
      isRushUnlocked(a.show, allUnlockedRushShowIds),
      a.showtimes[0]
    )
      ? 1
      : -1;
    const secondShowActiveNumber = isShowActive(
      isRushUnlocked(b.show, allUnlockedRushShowIds),
      b.showtimes[0]
    )
      ? 1
      : -1;
    return (
      secondShowActiveNumber - firstShowActiveNumber ||
      addTickets(b.showtimes) - addTickets(a.showtimes)
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContentContainer,
          {paddingTop: top, paddingBottom: bottom}
        ]}
        testID="rushShows">
        {sortedRushShows.map(({show, showtimes}) => (
          <ShowCard
            key={show.id}
            show={show}
            showtimes={showtimes}
            isRushUnlocked={isRushUnlocked(show, allUnlockedRushShowIds)}
            onCardPress={() =>
              navigation.navigate("ShowDetails", {
                show,
                showtimes
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default RushShowListScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  loadingSpinnerContainer: {flex: 1, justifyContent: "center"},
  scrollContentContainer: {rowGap: 15, paddingHorizontal: 20, paddingTop: 10}
});
