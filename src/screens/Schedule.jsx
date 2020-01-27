import React, { Component } from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import PropTypes from "prop-types";
import {
  CenteredActivityIndicator,
  PlainViewContainer,
} from "../components/Base";
import SwipableTabBar from "../components/SwipableTabBar";
import EventGroupComponent from "../components/schedule/EventGroupComponent";
import Saved from "./Saved";
import EventsManager from "../events/EventsManager";

export default class Schedule extends Component {
  constructor(props) {
    super(props);

    this.renderScheduleForDay = this.renderScheduleForDay.bind(this);
    this.renderEventCard = this.renderEventCard.bind(this);
  }

  renderScheduleForDay(eventDayObj) {
    const eventDay = eventDayObj.item;
    return (
      <FlatList
        key={eventDay.label}
        data={eventDay.eventGroups}
        renderItem={this.renderEventCard}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />
    );
  }

  renderEventCard(eventGroupObj) {
    const { eventManager } = this.props;
    const eventGroup = eventGroupObj.item;
    return (
      <EventGroupComponent
        header={eventGroup.label}
        events={eventGroup.events}
        eventManager={eventManager}
        origin="Schedule"
      />
    );
  }

  render() {
    const { eventManager } = this.props;
    const eventDays = eventManager.getEventDays();
    if (eventDays.length === 0) {
      return <CenteredActivityIndicator />;
    }
    return (
      <PlainViewContainer>
        <ScrollableTabView
          renderTabBar={({ goToPage, tabs, activeTab }) => (
            <SwipableTabBar {...{ goToPage, tabs, activeTab }} />
          )}
        >
          {eventDays.map(eventDay => (
            <FlatList
              data={[eventDay]}
              renderItem={this.renderScheduleForDay}
              keyExtractor={eventGroup => eventGroup.label}
              tabLabel={eventDay.label}
              key={eventDay.label}
              style={styles.tabView}
            />
          ))}
          <ScrollView tabLabel="ios-star" style={styles.tabView}>
            <Saved
              ref={mySaved => {
                this.mySaved = mySaved;
                eventManager.registerEventChangeListener(mySaved);
              }}
              eventManager={eventManager}
            />
          </ScrollView>
        </ScrollableTabView>
      </PlainViewContainer>
    );
  }
}

const styles = StyleSheet.create({
  tabView: {
    backgroundColor: "rgba(0,0,0,0.01)",
    flex: 1,
  },
});

Schedule.propTypes = {
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
};
