import React, { useState, useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, PadContainer, SubHeading } from "../Base";
import EventsList from "./EventsList";
import { EventsContext } from "../../events/EventsContext";

export default function Saved() {
  const [arePastEventsVisible, setArePastEventsVisible] = useState(false);
  const { eventsManager } = useContext(EventsContext);
  const events = eventsManager.getSavedEventsArray();

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
            text={`${arePastEventsVisible ? "Hide" : "Show"} ${
              pastEvents.length
            } past event${pastEvents.length > 1 ? "s" : ""}`}
            style={styles.showPastEventsButton}
            onPress={() => setArePastEventsVisible(!arePastEventsVisible)}
            accessibilityLabel="Toggle Past Events"
          />
        )}
        <EventsList
          events={pastEvents}
          eventManager={eventsManager}
          shouldDisplay={pastEvents.length > 0 && arePastEventsVisible}
        />

        <EventsList
          events={upcomingEvents}
          eventManager={eventsManager}
          shouldDisplay={upcomingEvents.length > 0}
        />
      </PadContainer>
    </ScrollView>
  );
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
