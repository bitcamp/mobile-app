import PropTypes from "prop-types";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { H3 } from "../Text";
import EventCard from "./EventCard";
import Event from "../../events/Event";
import EventsManager from "../../events/EventsManager";

export default function EventColumns({ origin, eventManager, eventsArr }) {
  const getCardCol = (event, index) =>
    event && (
      <View
        style={[
          styles.halfColumn,
          index === 0 ? styles.firstCol : styles.otherCol,
        ]}
        key={index}
      >
        <EventCard event={event} eventManager={eventManager} origin={origin} />
      </View>
    );

  const getRowOfEvents = () => {
    const rowEventsList = eventsArr.map(getCardCol);

    if (rowEventsList.length === 0) {
      return <H3 style={styles.noEvents}>No events at this time.</H3>;
    }

    return (
      <ScrollView
        horizontal
        style={styles.eventRowScroller}
        showsHorizontalScrollIndicator={false}
      >
        {rowEventsList}
      </ScrollView>
    );
  };

  return <View style={styles.eventRowContainer}>{getRowOfEvents()}</View>;
}

const styles = StyleSheet.create({
  eventRowContainer: {
    flex: 1,
  },
  eventRowScroller: {
    paddingRight: 10,
  },
  firstCol: {
    marginLeft: 20,
  },
  halfColumn: {
    flex: 5,
    flexDirection: "column",
    marginRight: 20,
  },
  noEvents: {
    marginLeft: 20,
    opacity: 0.8,
    textAlign: "left",
  },
  otherCol: {
    marginLeft: 0,
  },
});

EventColumns.propTypes = {
  eventsArr: PropTypes.arrayOf(PropTypes.instanceOf(Event)),
  origin: PropTypes.string.isRequired,
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
};

EventColumns.defaultProps = {
  eventsArr: [],
};
