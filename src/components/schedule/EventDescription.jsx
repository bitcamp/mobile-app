import React, { useRef, useEffect } from "react";
import { StyleSheet, View, ViewPropTypes } from "react-native";
import PropTypes from "prop-types";
import colors from "../Colors";
import EventStar from "../events/EventStar";
import PillBadge from "../PillBadge";
import { H3, H4 } from "../Text";
import Event from "../../events/Event";
import EventsManager from "../../events/EventsManager";
import ClickableEvent from "../events/ClickableEvent";

export default function EventDescription({
  event,
  eventManager,
  style,
  origin,
}) {
  const myStarRef = useRef(null);
  const myStar = myStarRef.current;

  // TODO: remove this stupid heartlistener stuff :(
  useEffect(() => {
    if (myStar) {
      eventManager.registerHeartListener(myStar);
    }

    return () => {
      eventManager.removeHeartListener(myStar);
    };
  }, [eventManager, myStar]);

  return (
    <ClickableEvent origin={origin} event={event} style={style}>
      <View style={[styles.row, styles.eventcard]}>
        <View style={styles.column}>
          <H3 style={styles.title}>{event.title}</H3>
          <H4 style={styles.location}>{event.location}</H4>
          <View style={styles.badgeContainer}>
            {event.category.map((category, index) => (
              <View style={styles.badge} key={event.title + index.toString()}>
                <PillBadge category={category} />
              </View>
            ))}
          </View>
        </View>
        <View style={[styles.row, styles.favoriteButton]}>
          <EventStar
            ref={myStarRef}
            eventID={event.eventID.toString()}
            eventManager={eventManager}
            origin="Event Description"
          />
        </View>
      </View>
    </ClickableEvent>
  );
}

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
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
  style: ViewPropTypes.style,
};

EventDescription.defaultProps = {
  style: null,
};
