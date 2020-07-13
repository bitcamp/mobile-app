import React, { useState } from "react";
import { View, Platform, TouchableOpacity, StyleSheet } from "react-native";
import { SearchBar } from "react-native-elements";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import PropTypes from "prop-types";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import FullScreenModal from "../common/components/modals/FullScreenModal";
import { H3 } from "../common/components/Text";
import colors from "../Colors";
import PillBadge from "./PillBadge";
import { scale } from "../common/utils/scale";
import TabbedEventDays from "./TabbedEventDays";
import { useEventsState } from "../contexts/EventsContext/EventsHooks";
import { EVENT_CATEGORIES } from "../hackathon.config";
import EventDay from "../common/models/EventDay";
import EventsErrorHandler from "../common/components/events/EventsErrorHandler";
import { useFollowingState } from "../contexts/FollowingContext/FollowingHooks";

/**
 * Displays a searchable schedule containing all of the events.
 */
export default function SearchModal() {
  const [query, setQuery] = useState("");
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const navigation = useNavigation();

  const { eventDays, error: eventsError } = useEventsState();
  const { error: followInfoError } = useFollowingState();

  const filterEvents = searchQuery => {
    const escapedQuery = escapeRegExp(searchQuery.toLowerCase());
    let newSchedule = [];

    if (searchQuery !== "" && eventDays) {
      // Filter out any event that doesn't match the query
      newSchedule = eventDays
        .map(({ date, eventGroups }) => {
          // Because the event groups are already precomputed, we just
          // want to set the eventGroups field directly (rather than passing a
          // list of events)
          const filteredDay = new EventDay(date, []);

          filteredDay.eventGroups = eventGroups
            .map(({ data, ...eventGroup }) => ({
              ...eventGroup,
              data: data.filter(event => {
                // Checks if the event matches the category being searched
                const categorySearch = event.categories.some(
                  category => category.toLowerCase().search(escapedQuery) >= 0
                );

                // Also, check if the event's title matches the query
                return (
                  categorySearch ||
                  event.title.toLowerCase().search(escapedQuery) >= 0
                );
              }),
            }))
            .filter(group => group.data.length > 0);

          return filteredDay;
        })
        .filter(day => day.eventGroups.length > 0);
    }

    setFilteredSchedule(newSchedule);
    setQuery(escapedQuery);
  };

  const renderBadges = () => {
    return Array.from(EVENT_CATEGORIES).map(badgeTitle => (
      <TouchableOpacity
        onPress={() => filterEvents(badgeTitle)}
        key={badgeTitle}
      >
        <PillBadge category={badgeTitle} style={styles.badge} />
      </TouchableOpacity>
    ));
  };

  return (
    <FullScreenModal
      isVisible
      backdropColor="#f7f7f7"
      onBackButtonPress={navigation.goBack}
      contentStyle={styles.modalStyle}
      shouldntScroll
    >
      <View style={styles.headerContainer}>
        <SearchBar
          placeholder="Search"
          platform="android"
          onChangeText={searchQuery => filterEvents(searchQuery)}
          onClear={() => filterEvents("")}
          value={query}
          autoFocus={!(eventsError || followInfoError)}
          autoCapitalize="none"
          containerStyle={styles.flexible}
          inputContainerStyle={styles.inputContainerStyle}
          leftIconContainerStyle={styles.iconContainer}
          rightIconContainerStyle={styles.iconContainer}
          returnKeyType="search"
        />
        <View style={styles.textButtonContainer}>
          <TouchableOpacity
            onPress={navigation.goBack}
            style={styles.inflexible}
          >
            <H3 style={styles.exitText}>Cancel</H3>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View style={styles.tagContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {renderBadges()}
          </ScrollView>
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.7)",
              "rgba(255,255,255,0)",
              "rgba(255,255,255,0)",
              "rgba(255,255,255,0.7)",
            ]}
            locations={[0, 0.1, 0.8, 1]}
            start={[0, 0]}
            end={[1, 0]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        </View>
      </View>
      <EventsErrorHandler>
        <TabbedEventDays eventDays={filteredSchedule} origin="Search" />
      </EventsErrorHandler>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  badge: {
    marginLeft: 5,
  },
  exitText: {
    color: colors.primaryColor,
    padding: scale(15),
    paddingRight: 0,
    flex: 0,
    fontWeight: "500",
  },
  flexible: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: scale(15),
    paddingTop: Platform.OS === "ios" ? getStatusBarHeight() : 0,
  },
  iconContainer: {
    backgroundColor: colors.backgroundColor.dark,
  },
  inflexible: {
    flex: 0,
  },
  inputContainerStyle: {
    backgroundColor: colors.backgroundColor.dark,
    borderRadius: scale(10),
  },
  modalStyle: {
    padding: 0,
  },
  textButtonContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

SearchModal.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
