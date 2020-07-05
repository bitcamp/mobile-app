import ScrollableTabView from "react-native-scrollable-tab-view";
import React from "react";
import { StyleSheet, SectionList, View } from "react-native";
import PropTypes from "prop-types";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";
import moment from "moment";
import SwipableTabBar from "../common/components/SwipableTabBar";
import colors from "../Colors";
import { BaseText } from "../common/components/Text";
import EventDescription, { eventDescriptionHeight } from "./EventDescription";
import EventDay from "../common/models/EventDay";
import Event from "../common/models/Event";

// Simple components for the section list
const EventDescriptionWrapper = ({ item: event, origin }) => (
  <EventDescription event={event} origin={origin} />
);

const TimeHeader = ({ section: { time } }) => (
  <View style={styles.headerContainer}>
    <BaseText style={styles.header}>{time}</BaseText>
  </View>
);

/**
 * Lists all of the events in through props, split into tabs based on their start date.
 * Optionally takes in a list of additional tabs to render (e.g., a saved events tab).
 * Each tab in this list must have its own tabLabel.
 */
export default function TabbedEventDays({ eventDays, extraTabs, origin }) {
  const getItemLayout = sectionListGetItemLayout({
    getItemHeight: () => eventDescriptionHeight,
    getSeparatorHeight: () => itemSeperatorHeight,
    getSectionHeaderHeight: () => sectionHeaderHeight,
  });

  const renderTabForDay = eventDay => {
    return (
      <SectionList
        sections={eventDay.eventGroups}
        renderItem={({ item }) => (
          <EventDescriptionWrapper item={item} origin={origin} />
        )}
        keyExtractor={event => event.id}
        key={eventDay.date}
        tabLabel={eventDay.weekDay}
        style={styles.tabView}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
        renderSectionHeader={({ section }) => <TimeHeader section={section} />}
        getItemLayout={getItemLayout}
      />
    );
  };

  return (
    eventDays && (
      <ScrollableTabView
        style={styles.tabView}
        initialPage={0}
        prerenderingSiblingsNumber={1}
        renderTabBar={({ goToPage, tabs, activeTab }) => (
          <SwipableTabBar {...{ goToPage, tabs, activeTab }} />
        )}
      >
        {eventDays.map(renderTabForDay)}
        {extraTabs}
      </ScrollableTabView>
    )
  );
}

const itemSeperatorHeight = 1;
const sectionHeaderHeight = 35;

const styles = StyleSheet.create({
  header: {
    color: "black",
    fontSize: 20,
    fontWeight: "500",
  },
  headerContainer: {
    backgroundColor: colors.backgroundColor.dark,
    height: sectionHeaderHeight,
    justifyContent: "center",
    paddingLeft: 15,
    paddingVertical: 5,
  },
  seperator: {
    backgroundColor: "#e3e3e8",
    height: itemSeperatorHeight,
  },
  tabView: {
    backgroundColor: colors.backgroundColor.normal,
    flex: 1,
  },
});

TabbedEventDays.propTypes = {
  eventDays: PropTypes.arrayOf(PropTypes.instanceOf(EventDay)),
  extraTabs: PropTypes.arrayOf(PropTypes.element.isRequired),
  origin: PropTypes.string.isRequired,
};

TabbedEventDays.defaultProps = {
  extraTabs: null,
  eventDays: null,
};

EventDescriptionWrapper.propTypes = {
  item: PropTypes.instanceOf(Event).isRequired,
  origin: PropTypes.string.isRequired,
};

TimeHeader.propTypes = {
  section: PropTypes.shape({
    time: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(moment)]),
  }).isRequired,
};
