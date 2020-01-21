import React from "react";
import ClickableEvent from "./ClickableEvent";
import Banner from "../Banner";
import Images from "../../../assets/imgs/index";

/**
 * A full-width banner for an event that can be clicked to reveal a modal
 */
const EventBanner = ({ event, origin, eventManager }) => (
  <ClickableEvent event={event} origin={origin} props={eventManager}>
    <Banner
      title={event.titleClipped}
      description="HAPPENING NOW"
      imageSource={Images[event.img]}
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
