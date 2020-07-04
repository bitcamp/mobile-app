import React from "react";
import PropTypes from "prop-types";
import LargeEventCard from "./LargeEventCard";
import Event from "../contexts/EventsContext/Event";

export default function EventsList({ events, shouldDisplay }) {
  return (
    shouldDisplay && (
      <>
        {events.map(event => (
          <LargeEventCard key={event.id} event={event} origin="Saved" />
        ))}
      </>
    )
  );
}

EventsList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.instanceOf(Event).isRequired).isRequired,
  shouldDisplay: PropTypes.bool,
};

EventsList.defaultProps = {
  shouldDisplay: false,
};
