import ScrollableTabView from "react-native-scrollable-tab-view";
import React, { useContext } from "react";
import { StyleSheet, SectionList, View } from "react-native";
import PropTypes from "prop-types";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";
import SwipableTabBar from "./SwipableTabBar";
import EventDay from "../events/EventDay";
import { EventsContext } from "../events/EventsContext";
import colors from "./Colors";
import { BaseText } from "./Text";
import EventDescription, {
  eventDescriptionHeight,
} from "./schedule/EventDescription";
/**
 * Lists all of the events in through props, split into tabs based on their start date.
 * Optionally takes in a list of additional tabs to render (e.g., a saved events tab).
 * Each tab in this list must have its own tabLabel.
 */
export default function TabbedEventDays({ eventDays, extraTabs, origin }) {
  const { eventsManager } = useContext(EventsContext);

  const renderEventCard = ({ item: event }) => (
    <EventDescription
      event={event}
      eventManager={eventsManager}
      origin={origin}
    />
  );

  const renderTimeHeader = ({ section: { title } }) => (
    <View style={styles.headerContainer}>
      <BaseText style={styles.header}>{title}</BaseText>
    </View>
  );

  const getItemLayout = sectionListGetItemLayout({
    getItemHeight: () => eventDescriptionHeight,
    getSeparatorHeight: () => itemSeperatorHeight,
    getSectionHeaderHeight: () => sectionHeaderHeight,
  });

  const renderTabForDay = eventDay => {
    return (
      <SectionList
        sections={eventDay.eventGroups}
        renderItem={renderEventCard}
        keyExtractor={event => event.eventID}
        key={eventDay.label}
        tabLabel={eventDay.label}
        style={styles.tabView}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
        renderSectionHeader={renderTimeHeader}
        getItemLayout={getItemLayout}
      />
    );
  };

  return (
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
  eventDays: PropTypes.arrayOf(PropTypes.instanceOf(EventDay)).isRequired,
  extraTabs: PropTypes.arrayOf(PropTypes.element.isRequired),
  origin: PropTypes.string.isRequired,
};

TabbedEventDays.defaultProps = {
  extraTabs: null,
};
