import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { H3 } from "../common/components/Text";
import EventCard from "../common/components/events/EventCard";
import Event from "../common/models/Event";

export default function EventColumns({ origin, eventsArr }) {
  return (
    <View style={styles.eventRowContainer}>
      <FlatList
        horizontal
        style={styles.eventRowScroller}
        showsHorizontalScrollIndicator={false}
        keyExtractor={event => event.id.toString()}
        initialNumToRender={3}
        ListEmptyComponent={<H3>No events at this time.</H3>}
        data={eventsArr ? eventsArr.slice(0, 10) : []}
        renderItem={({ item: event }) => (
          <View style={styles.column}>
            <EventCard event={event} origin={origin} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flex: 5,
    flexDirection: "column",
    marginRight: 20,
  },
  eventRowContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
});

EventColumns.propTypes = {
  eventsArr: PropTypes.arrayOf(PropTypes.instanceOf(Event)),
  origin: PropTypes.string.isRequired,
};

EventColumns.defaultProps = {
  eventsArr: [],
};
