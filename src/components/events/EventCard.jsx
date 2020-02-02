import React, { Component } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import Images from "../../../assets/imgs/index";
import { scale } from "../../utils/scale";
import { getDeviceWidth, getImageHeight } from "../../utils/sizing";
import colors from "../Colors";
import { BaseText } from "../Text";
import ClickableEvent from "./ClickableEvent";
import Event from "../../events/Event";
import EventsManager from "../../events/EventsManager";

export default class EventCard extends Component {
  getColor() {
    const overlayColor = {
      Main: "#5996B3",
      Food: "#AB622A",
      Workshop: "#A53C32",
      Mini: "#496B7D",
      Sponsor: "#544941",
      Mentor: "#595049",
      Demo: "#645D54",
      Ceremony: "#BBB35D",
      Colorwar: "#405962",
      Campfire: "#81581F",
    };
    const { event } = this.props;

    let color = overlayColor[event.category[0]];
    if (
      event.title === "Opening Ceremony" ||
      event.title === "Closing Ceremony"
    ) {
      color = overlayColor.Ceremony;
    } else if (event.title === "Expo A" || event.title === "Expo B") {
      color = overlayColor.Demo;
    } else if (event.title === "COLORWAR") {
      color = overlayColor.Colorwar;
    }

    return color;
  }

  render() {
    const { event, eventManager, origin } = this.props;

    return (
      <ClickableEvent eventManager={eventManager} event={event} origin={origin}>
        <View>
          <ImageBackground
            style={styles.imgBg}
            source={Images[event.img]}
            imageStyle={styles.roundedImg}
          >
            <View style={styles.favoriteBar}>
              <View
                style={[
                  { backgroundColor: this.getColor() },
                  styles.favoriteInfo,
                ]}
              >
                <Ionicons name="ios-star" size={scale(15)} color="white" />
                <BaseText style={styles.favoriteCount}>
                  {eventManager.getSavedCount(event.eventID)}
                </BaseText>
              </View>
            </View>

            <View
              style={[
                { backgroundColor: this.getColor() },
                styles.titleContainer,
              ]}
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
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
  origin: PropTypes.string.isRequired,
};
