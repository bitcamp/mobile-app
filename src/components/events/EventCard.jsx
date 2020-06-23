import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { scale } from "../../utils/scale";
import { getDeviceWidth, getImageHeight } from "../../utils/sizing";
import colors from "../Colors";
import { BaseText } from "../Text";
import ClickableEvent from "./ClickableEvent";
import Event from "../../contexts/EventsContext/Event";
import { useFollowingActions } from "../../contexts/FollowingContext/FollowingHooks";

export default function EventCard({ event, origin }) {
  const { getFollowCount } = useFollowingActions();

  return (
    <ClickableEvent event={event} origin={origin}>
      <View>
        <ImageBackground
          style={styles.imgBg}
          source={event.image}
          imageStyle={styles.roundedImg}
        >
          <View style={styles.favoriteBar}>
            <View
              style={[{ backgroundColor: event.color }, styles.favoriteInfo]}
            >
              <Ionicons name="ios-star" size={scale(15)} color="white" />
              <BaseText style={styles.favoriteCount}>
                {getFollowCount(event.id)}
              </BaseText>
            </View>
          </View>

          <View
            style={[{ backgroundColor: event.color }, styles.titleContainer]}
          >
            <BaseText numberOfLines={1} style={styles.eventTitle}>
              {event.title}
            </BaseText>
          </View>
        </ImageBackground>
        <BaseText style={styles.caption} numberOfLines={1}>
          {event.caption}
        </BaseText>
      </View>
    </ClickableEvent>
  );
}

const imageWidth = getDeviceWidth() / 2 + 10;
const imageHeight = getImageHeight(imageWidth);

const styles = StyleSheet.create({
  caption: {
    color: colors.textColor.light,
    width: imageWidth,
  },
  eventTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    paddingBottom: 5,
    paddingLeft: 13,
    paddingTop: 5,
    width: imageWidth - 10,
  },
  favoriteBar: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  favoriteCount: {
    color: "white",
    fontSize: scale(13),
    marginLeft: 5,
  },
  favoriteInfo: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    height: scale(23),
    marginRight: 6,
    marginTop: 6,
    paddingHorizontal: 10,
  },
  imgBg: {
    height: imageHeight,
    marginBottom: 5,
    width: imageWidth,
  },
  roundedImg: {
    borderRadius: 13,
  },
  titleContainer: {
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
    marginTop: imageHeight - 60,
  },
});

EventCard.propTypes = {
  event: PropTypes.instanceOf(Event).isRequired,
  origin: PropTypes.string.isRequired,
};
