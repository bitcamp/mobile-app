import ScrollableTabView from "react-native-scrollable-tab-view";
import React, { useContext } from "react";
import { FlatList, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import EventGroupComponent from "./schedule/EventGroupComponent";
import SwipableTabBar from "./SwipableTabBar";
import EventDay from "../events/EventDay";
import { EventsContext } from "../events/EventsContext";
import colors from "./Colors";

/**
 * Lists all of the events in through props, split into tabs based on their start date.
 * Optionally takes in a list of additional tabs to render (e.g., a saved events tab).
 * Each tab in this list must have its own tabLabel.
 */
export default function TabbedEventDays({ eventDays, extraTabs }) {
  const { eventsManager } = useContext(EventsContext);

  const renderEventCard = eventGroupObj => {
    const eventGroup = eventGroupObj.item;
    return (
      <EventGroupComponent
        header={eventGroup.label}
        events={eventGroup.events}
        eventManager={eventsManager}
        origin="Search"
      />
    );
  };

  const renderTabForDay = eventDay => {
    return (
      <FlatList
        data={eventDay.eventGroups}
        renderItem={renderEventCard}
        keyExtractor={eventGroup => `${eventDay.label} ${eventGroup.label}`}
        key={eventDay.label}
        tabLabel={eventDay.label}
        style={styles.tabView}
      />
    );
  };

  return (
    <ScrollableTabView
      renderTabBar={({ goToPage, tabs, activeTab }) => (
        <SwipableTabBar {...{ goToPage, tabs, activeTab }} />
      )}
      style={styles.tabView}
      initialPage={0}
      prerenderingSiblingsNumber={1}
    >
      {eventDays.map(renderTabForDay)}
      {extraTabs}
    </ScrollableTabView>
  );
}

const styles = StyleSheet.create({
  tabView: {
    backgroundColor: colors.backgroundColor.normal,
    flex: 1,
  },
});

TabbedEventDays.propTypes = {
  eventDays: PropTypes.arrayOf(PropTypes.instanceOf(EventDay)).isRequired,
  extraTabs: PropTypes.arrayOf(PropTypes.element.isRequired),
};

TabbedEventDays.defaultProps = {
  extraTabs: null,
};
