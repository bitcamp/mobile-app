import ScrollableTabView from "react-native-scrollable-tab-view";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import EventGroupComponent from "./schedule/EventGroupComponent";
import SwipableTabBar from "./SwipableTabBar";
import EventDay from "../events/EventDay";
import EventsManager from "../events/EventsManager";

export default class SearchBarTabView extends React.Component {
  constructor(props) {
    super(props);
    this.renderEventCard = this.renderEventCard.bind(this);
    this.renderScheduleForDay = this.renderScheduleForDay.bind(this);
  }

  renderEventCard(eventGroupObj) {
    const { eventManager } = this.props;
    const eventGroup = eventGroupObj.item;
    return (
      <EventGroupComponent
        header={eventGroup.label}
        events={eventGroup.events}
        eventManager={eventManager}
        origin="Search"
      />
    );
  }

  renderScheduleForDay(eventDayObj) {
    const eventDay = eventDayObj.item;
    return (
      <FlatList
        key={eventDay.label}
        data={eventDay.eventGroups}
        renderItem={this.renderEventCard}
        keyExtractor={eventGroup => `${eventDay.label} ${eventGroup.label}`}
        scrollEnabled={false}
      />
    );
  }

  renderSearchResults(schedule) {
    return schedule.map(eventDay => (
      <FlatList
        data={[eventDay]}
        renderItem={this.renderScheduleForDay}
        keyExtractor={eventDayObj => `${eventDayObj.label} list`}
        key={eventDay.label}
        tabLabel={eventDay.label}
        style={styles.tabView}
      />
    ));
  }

  render() {
    const { screenHeight, offsetHeight, keyboardHeight, schedule } = this.props;

    return (
      <ScrollableTabView
        renderTabBar={({ goToPage, tabs, activeTab }) => (
          <SwipableTabBar {...{ goToPage, tabs, activeTab }} />
        )}
        style={{
          height: screenHeight - (offsetHeight + 2 + keyboardHeight),
        }}
        initialPage={0}
      >
        {schedule.length > 0 && this.renderSearchResults(schedule)}
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
  },
});

SearchBarTabView.propTypes = {
  screenHeight: PropTypes.number.isRequired,
  offsetHeight: PropTypes.number.isRequired,
  keyboardHeight: PropTypes.number.isRequired,
  schedule: PropTypes.arrayOf(PropTypes.instanceOf(EventDay)).isRequired,
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
};
