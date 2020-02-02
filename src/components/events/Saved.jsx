import React, { Component } from "react";
import { ScrollView, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { Button, PadContainer, SubHeading } from "../Base";
import EventsManager from "../../events/EventsManager";
import EventsList from "./EventsList";

export default class Saved extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingPastEvents: false,
    };
  }

  render() {
    const { eventManager } = this.props;
    const { isShowingPastEvents } = this.state;
    const events = eventManager.getSavedEventsArray();

    const pastEvents = events.filter(event => event.hasPassed);
    const upcomingEvents = events.filter(event => !event.hasPassed);

    // TODO: investigate why unfavoriting an event doesn't update the saved events
    // list. This might be fixed in the eventsmanager refactoring task.

    return (
      <ScrollView>
        <PadContainer>
          <SubHeading style={styles.subSectionHeading}>
            {events.length} events saved
          </SubHeading>

          {// Show the past events button if there are past events
          pastEvents.length > 0 && (
            <Button
              text={`${isShowingPastEvents ? "Hide" : "Show"} ${
                pastEvents.length
              } past event${pastEvents.length > 1 ? "s" : ""}`}
              style={styles.showPastEventsButton}
              onPress={() =>
                this.setState(({ isShowingPastEvents: showingPrevEvents }) => ({
                  isShowingPastEvents: !showingPrevEvents,
                }))
              }
              accessibilityLabel="Toggle Past Events"
            />
          )}
          <EventsList
            events={pastEvents}
            eventManager={eventManager}
            shouldDisplay={pastEvents.length > 0 && isShowingPastEvents}
          />

          <EventsList
            events={upcomingEvents}
            eventManager={eventManager}
            shouldDisplay={upcomingEvents.length > 0}
          />
        </PadContainer>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  showPastEventsButton: {
    marginBottom: 20,
    marginHorizontal: 0,
  },
  subSectionHeading: {
    marginBottom: 0,
    paddingVertical: 25,
    textAlign: "center",
  },
});

Saved.propTypes = {
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
};
