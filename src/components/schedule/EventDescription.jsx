import React from "react";
import { StyleSheet, View, ViewPropTypes } from "react-native";
import PropTypes from "prop-types";
import colors from "../Colors";
import EventStar from "../events/EventStar";
import PillBadge from "../PillBadge";
import { H3, H4 } from "../Text";
import ClickableEvent from "../events/ClickableEvent";
import Event from "../../contexts/EventsContext/Event";

export default function EventDescription({ event, style, origin }) {
  return (
    <ClickableEvent origin={origin} event={event} style={style}>
      <View style={[styles.row, styles.eventcard]}>
        <View style={styles.column}>
          <H3 style={styles.title} numberOfLines={2}>
            {event.title}
          </H3>
          <H4 style={styles.location}>{event.location}</H4>
          <View style={styles.badgeContainer}>
            {event.categories.map((category, index) => (
              <View style={styles.badge} key={event.title + index.toString()}>
                <PillBadge category={category} />
              </View>
            ))}
          </View>
        </View>
        <View style={[styles.row, styles.favoriteButton]}>
          <EventStar eventId={event.id} origin="Event Description" />
        </View>
      </View>
    </ClickableEvent>
  );
}

/** Height of the event description (used to precompute the height in section lists) */
export const eventDescriptionHeight = 100;

const styles = StyleSheet.create({
  badge: {
    marginRight: 5,
  },
  badgeContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
    flex: 4,
    paddingHorizontal: 0,
  },
  eventcard: {
    alignItems: "center",
    height: eventDescriptionHeight,
    padding: 12.5,
  },
  favoriteButton: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  location: {
    color: colors.textColor.light,
    fontSize: 17.5,
  },
  row: {
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
  },
});

EventDescription.propTypes = {
  origin: PropTypes.string.isRequired,
  event: PropTypes.instanceOf(Event).isRequired,
  style: ViewPropTypes.style,
};

EventDescription.defaultProps = {
  style: null,
};
