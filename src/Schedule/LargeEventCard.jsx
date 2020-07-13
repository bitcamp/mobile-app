import React from "react";
import { Image, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import ClickableEvent from "../common/components/events/ClickableEvent";
import { getDeviceWidth, getImageHeight } from "../common/utils/sizing";
import EventDescription from "./EventDescription";
import Event from "../common/models/Event";

const LargeEventCard = ({ event, origin, ...props }) => (
  <ClickableEvent event={event} origin={origin} style={styles.event}>
    <Image
      style={[styles.image, styles.roundedCorners]}
      source={event.image}
      imageStyle={styles.roundedCorners}
    />
    <EventDescription {...{ event, origin, ...props }} />
  </ClickableEvent>
);

const imageWidth = getDeviceWidth() - 40;
const imageHeight = getImageHeight(imageWidth) / 2;
const styles = StyleSheet.create({
  event: {
    marginBottom: 25,
  },
  image: {
    height: imageHeight,
    width: imageWidth,
  },
  roundedCorners: {
    borderRadius: 13,
  },
});

LargeEventCard.propTypes = {
  event: PropTypes.instanceOf(Event).isRequired,
  origin: PropTypes.string.isRequired,
};

export default LargeEventCard;
