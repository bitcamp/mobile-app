import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import PropTypes from "prop-types";
import { BaseText } from "../Text";
import EventDescription from "./EventDescription";
import Event from "../../events/Event";
import EventsManager from "../../events/EventsManager";

export default function EventGroupComponent({
  header,
  events,
  eventManager,
  origin,
}) {
  const headerWithoutAMPM = header.substring(0, header.length - 2);
  const AMOrPM = header.endsWith("am") ? " AM" : " PM";
  return (
    <>
      <BaseText style={styles.header}>{headerWithoutAMPM + AMOrPM}</BaseText>
      <FlatList
        data={events}
        renderItem={eventObj => {
          const currEvent = eventObj.item;
          return (
            <EventDescription
              event={currEvent}
              eventManager={eventManager}
              origin={origin}
            />
          );
        }}
        ItemSeparatorComponent={() => {
          return <View style={styles.seperator} />;
        }}
        keyExtractor={event => event.eventID.toString()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f7f7f7",
    color: "black",
    fontSize: 20,
    fontWeight: "500",
    paddingBottom: 5,
    paddingLeft: 15,
    paddingTop: 5,
  },
  seperator: {
    backgroundColor: "#e3e3e8",
    height: 1.5,
  },
});

EventGroupComponent.propTypes = {
  header: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
  origin: PropTypes.string.isRequired,
};
