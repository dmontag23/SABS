import React from "react";
import { StyleSheet, View } from "react-native";

import {
  Card,
  Chip,
  Text,
  TouchableRipple,
  useTheme
} from "react-native-paper";

import TodayTixBanner from "../assets/TodayTixBanner.jpg";
import { TodayTixShow } from "../types/shows";
import { TodayTixShowtime } from "../types/showtimes";

const extractTimeFromDateString = (dateString: string | undefined) => {
  if (dateString) return new Date(dateString).toTimeString().slice(0, 5);
};

const isRushOpenToday = (showtime: TodayTixShowtime) => {
  /* the rush open check assumes that rush is only open at some point in the day when there is
  a start and end time associated to the rush tickets, i.e. the rushTickets.availableAfter 
  and rushTickets.availableUntil have values */
  const rushStartTime = extractTimeFromDateString(
    showtime?.rushTickets?.availableAfter
  );
  const rushEndTime = extractTimeFromDateString(
    showtime?.rushTickets?.availableUntil
  );
  return Boolean(rushStartTime && rushEndTime);
};

export const isShowActive = (
  isRushUnlocked: boolean,
  showtime: TodayTixShowtime
) => isRushUnlocked && isRushOpenToday(showtime);

const RushShowtimeInfo = (rushShowtimes: TodayTixShowtime[]) => (
  <View style={styles.showtimesInfoContainer}>
    {rushShowtimes.length ? (
      rushShowtimes.map(showtime => (
        <View key={showtime.id} style={styles.showtimeAndTicketNumContainer}>
          <Text style={styles.subtitle}>{showtime.localTime}</Text>
          <Text
            style={styles.subtitle}
          >{`Tickets: ${showtime.rushTickets?.quantityAvailable ?? 0}`}</Text>
        </View>
      ))
    ) : (
      <Text style={styles.subtitle}>No tickets for today</Text>
    )}
  </View>
);

type CardSubtitleArgs = {
  isRushUnlocked: boolean;
  isRushOpen: boolean;
  rushTicketPrice: string;
  maxNumOfRushTickets: number;
};

const CardSubtitle = ({
  isRushUnlocked,
  isRushOpen,
  rushTicketPrice,
  maxNumOfRushTickets
}: CardSubtitleArgs) => {
  if (!isRushUnlocked)
    return (
      <Text style={styles.subtitle}>Rush is not unlocked for this show.</Text>
    );
  if (isRushOpen)
    return (
      <View>
        <Text style={styles.subtitle}>{rushTicketPrice}</Text>
        <Text style={styles.subtitle}>
          {`${maxNumOfRushTickets} per person max`}
        </Text>
      </View>
    );
};

type ShowCardProps = {
  show: TodayTixShow;
  showtimes: TodayTixShowtime[];
  isRushUnlocked: boolean;
  onCardPress?: () => void;
};

const ShowCard = ({
  show,
  showtimes,
  isRushUnlocked,
  onCardPress
}: ShowCardProps) => {
  const { roundness, colors } = useTheme();

  const maxNumOfRushTickets = showtimes[0]?.rushTickets?.maxTickets;
  const rushTicketPrice = show.lowPriceForRushTickets?.display;
  const rushStartTime = extractTimeFromDateString(
    showtimes[0]?.rushTickets?.availableAfter
  );
  const rushEndTime = extractTimeFromDateString(
    showtimes[0]?.rushTickets?.availableUntil
  );
  const isRushOpen = isRushOpenToday(showtimes[0]);
  const isActive = isShowActive(isRushUnlocked, showtimes[0]);

  return (
    <View>
      <TouchableRipple
        borderless
        onPress={onCardPress}
        style={[
          isActive ? styles.cardWithChip : {},
          {
            borderRadius: roundness
          },
          styles.cardBorder
        ]}
      >
        <Card accessibilityLabel="Show card" mode="contained">
          <Card.Cover
            resizeMode="stretch"
            source={{
              uri: `${__DEV__ ? "http" : "https"}:${show.images?.productMedia.appHeroImage.file.url}`
            }}
            defaultSource={TodayTixBanner}
            theme={{ roundness: 0 }}
            style={[
              styles.image,
              {
                borderTopLeftRadius: roundness,
                borderTopRightRadius: roundness
              }
            ]}
          />
          <Card.Title
            title={show.displayName}
            subtitle={CardSubtitle({
              isRushUnlocked,
              isRushOpen,
              rushTicketPrice: rushTicketPrice ?? "",
              maxNumOfRushTickets: maxNumOfRushTickets ?? 0
            })}
            right={() => RushShowtimeInfo(showtimes)}
            titleStyle={styles.title}
          />
        </Card>
      </TouchableRipple>
      {isActive ? (
        <Chip compact style={styles.chip} textStyle={styles.chipText}>
          {`${rushStartTime} to ${rushEndTime}`}
        </Chip>
      ) : (
        <View
          accessibilityLabel="Inactive card"
          style={[
            styles.disabledOverlay,
            {
              backgroundColor: colors.shadow,
              borderRadius: roundness
            },
            styles.cardBorder
          ]}
        />
      )}
    </View>
  );
};

export default ShowCard;

const styles = StyleSheet.create({
  cardBorder: { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  cardWithChip: { marginTop: 15 },
  chip: { position: "absolute", left: 10 },
  chipText: { fontSize: 8 },
  disabledOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.3
  },
  image: { height: 150 },
  showtimeAndTicketNumContainer: { alignItems: "center" },
  showtimesInfoContainer: {
    maxWidth: 120,
    marginRight: 10,
    flexDirection: "row",
    columnGap: 10
  },
  subtitle: { fontSize: 11 },
  title: { fontSize: 14 }
});
