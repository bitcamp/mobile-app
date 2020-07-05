import React from "react";
import ClickableEvent from "./ClickableEvent";
import Banner from "../Banner";

/**
 * A full-width banner for an event that can be clicked to reveal a modal
 */
const EventBanner = ({ event, origin }) => (
  <ClickableEvent event={event} origin={origin}>
    <Banner
      title={event.title}
      description="HAPPENING NOW"
      imageSource={event.image}
    />
  </ClickableEvent>
);

// Assume that the event banner is coming from the home page
EventBanner.defaultProps = {
  origin: "Home",
};

// The event banner has the same propTypes as ClickableEvents
EventBanner.propTypes = ClickableEvent.propTypes;

export default EventBanner;
