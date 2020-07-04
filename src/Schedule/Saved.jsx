import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, PadContainer, SubHeading } from "../common/components/Base";
import EventsList from "./EventsList";
import { useEventActions } from "../contexts/EventsContext/EventsHooks";
import { useFollowingState } from "../contexts/FollowingContext/FollowingHooks";

export default function Saved() {
  const [arePastEventsVisible, setArePastEventsVisible] = useState(false);
  const { getEvent } = useEventActions();
  const { userFollowedEvents } = useFollowingState();

  const followedEvents = [...userFollowedEvents].map(getEvent);

  const pastEvents = followedEvents.filter(event => event.hasPassed);
  const upcomingEvents = followedEvents.filter(event => !event.hasPassed);

  // TODO: investigate why unfavoriting an event doesn't update the saved events
  // list. This might be fixed in the eventsmanager refactoring task.

  return (
    <ScrollView>
      <PadContainer>
        <SubHeading style={styles.subSectionHeading}>
          {followedEvents.length} events saved
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
          shouldDisplay={pastEvents.length > 0 && arePastEventsVisible}
        />

        <EventsList
          events={upcomingEvents}
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
