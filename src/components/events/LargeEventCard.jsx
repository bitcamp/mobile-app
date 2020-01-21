import React from "react";
import { Image, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import ClickableEvent from "./ClickableEvent";
import { getDeviceWidth, getImageHeight } from "../../utils/sizing";
import EventDescription from "../schedule/EventDescription";
import Images from "../../../assets/imgs/index";
import EventsManager from "../../events/EventsManager";
import Event from "../../events/Event";

const LargeEventCard = ({ eventManager, event, origin, ...props }) => (
  <ClickableEvent
    eventManager={eventManager}
    event={event}
    origin={origin}
    style={styles.event}
  >
    <Image
      style={styles.image}
      source={Images[event.img]}
      imageStyle={{ borderRadius: 13 }}
    />
    <EventDescription {...props} disabled />
  </ClickableEvent>
);

const imageWidth = getDeviceWidth() - 40;
const imageHeight = getImageHeight(imageWidth) / 2;
const styles = StyleSheet.create({
  event: {
    marginBottom: 25,
  },
  image: {
    borderRadius: 13,
    height: imageHeight,
    width: imageWidth,
  },
});

LargeEventCard.propTypes = {
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
  event: PropTypes.instanceOf(Event).isRequired,
  origin: PropTypes.string.isRequired,
};

export default LargeEventCard;
