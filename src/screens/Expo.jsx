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
import Saved from "../components/events/Saved";
import EventsManager from "../events/EventsManager";

// TODO: refactor this, since it is VERY similar to the <Schedule> component
export default class Expo extends Component {
  constructor(props) {
    super(props);

    this.renderScheduleForDay = this.renderScheduleForDay.bind(this);
    this.renderEventCard = this.renderEventCard.bind(this);
  }

  renderScheduleForDay(eventDayObj) {
    const eventDay = eventDayObj.item;
    // console.log(eventDayObj);
    return (
      <FlatList
        key={eventDay.label}
        data={eventDay.eventGroups}
        renderItem={this.renderEventCard}
        keyExtractor={eventGroup => eventGroup.label}
        scrollEnabled={false}
      />
    );
  }

  renderEventCard(eventGroupObj) {
    const eventGroup = eventGroupObj.item;
    const { eventManager } = this.props;
    return (
      <EventGroupComponent
        header={eventGroup.label}
        events={eventGroup.events}
        eventManager={eventManager}
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
          initialPage={0}
          renderTabBar={({ goToPage, tabs, activeTab }) => (
            <SwipableTabBar {...{ goToPage, tabs, activeTab }} />
          )}
        >
          {eventDays.map(eventDay => (
            <ScrollView
              key={eventDay.label}
              tabLabel={eventDay.label}
              style={styles.tabView}
            >
              <FlatList
                data={[eventDay]}
                renderItem={this.renderScheduleForDay}
                keyExtractor={(event, index) => index.toString()}
              />
            </ScrollView>
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

Expo.propTypes = {
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
};
