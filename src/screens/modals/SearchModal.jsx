import React, { Component } from "react";
import { View, Platform, TouchableOpacity, StyleSheet } from "react-native";
import { SearchBar } from "react-native-elements";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import PropTypes from "prop-types";
import _ from "lodash";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import FullScreenModal from "../../components/modals/FullScreenModal";
import { H3 } from "../../components/Text";
import colors from "../../components/Colors";
import PillBadge from "../../components/PillBadge";
import { scale } from "../../utils/scale";
import { eventCategories } from "../../events/eventConfig";
import { EventsContext } from "../../events/EventsContext";
import TabbedEventDays from "../../components/TabbedEventDays";

/**
 * Displays a searchable schedule containing all of the events.
 */
export default class SearchModal extends Component {
  static contextType = EventsContext;

  constructor(props) {
    super(props);
    this.filterEvents = this.filterEvents.bind(this);
    this.state = {
      search: "",
      newSchedule: [],
    };
  }

  filterEvents(query) {
    const { eventsManager } = this.context;
    const eventDays = eventsManager.getEventDays();
    const queryRegex = escapeRegExp(query.toLowerCase());
    let newSchedule = [];

    if (query !== "") {
      newSchedule = _.cloneDeep(eventDays);

      // Filter out any event that doesn't match the query
      newSchedule = newSchedule.map(eventDay => ({
        ...eventDay,
        eventGroups: eventDay.eventGroups
          .map(eventGroup => ({
            ...eventGroup,
            events: eventGroup.events.filter(event => {
              // Checks if the event matches the category being searched
              const categorySearch = Array.isArray(event.category)
                ? event.category.some(
                    category => category.toLowerCase().search(queryRegex) >= 0
                  )
                : event.category.toLowerCase().search(queryRegex) >= 0;

              // Also, check if the event's title matches the query
              return (
                event.title.toLowerCase().search(queryRegex) >= 0 ||
                categorySearch
              );
            }),
          }))
          .filter(group => group.events.length > 0),
      }));
    }

    this.setState({
      newSchedule,
      search: query,
    });
  }

  renderBadges() {
    return Array.from(eventCategories).map(badgeTitle => (
      <TouchableOpacity
        onPress={() => this.filterEvents(badgeTitle)}
        key={badgeTitle}
      >
        <PillBadge category={badgeTitle} style={styles.badge} />
      </TouchableOpacity>
    ));
  }

  render() {
    const { navigation } = this.props;
    const { newSchedule: oldSchedule, search } = this.state;

    const newSchedule = oldSchedule.filter(day => day.eventGroups.length > 0);

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
            onChangeText={query => this.filterEvents(query)}
            onClear={() => this.filterEvents("")}
            value={search}
            autoFocus
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
              {this.renderBadges()}
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
        <TabbedEventDays eventDays={newSchedule} />
      </FullScreenModal>
    );
  }
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
