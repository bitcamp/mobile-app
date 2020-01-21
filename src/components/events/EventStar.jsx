import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { H3 } from "../Text";
import { colors } from "../Colors";
import EventsManager from "../../events/EventsManager";

export default class EventStar extends Component {
  constructor(props) {
    super(props);
    this.handleHeartPress = this.handleHeartPress.bind(this);
  }

  handleHeartPress() {
    const { eventID, eventManager, origin } = this.props;
    if (eventManager.isFavorited(eventID)) {
      eventManager.unfavoriteEvent(eventID);
    } else {
      eventManager.favoriteEvent(eventID);
    }
    if (origin === "Event Description") {
      eventManager.updateEventComponents();
    }
  }

  render() {
    const { eventManager, eventID, discludeArrow } = this.props;

    return (
      <>
        <H3 style={styles.savedCount}>{eventManager.getSavedCount(eventID)}</H3>
        <TouchableOpacity
          onPress={() => {
            this.handleHeartPress();
          }}
        >
          <Ionicons
            name="ios-star"
            size={30}
            color={
              eventManager.isFavorited(eventID)
                ? colors.starColor.selected
                : colors.starColor.unselected
            }
          />
        </TouchableOpacity>
        {!discludeArrow && (
          <Ionicons
            style={styles.arrow}
            name="ios-arrow-forward"
            size={20}
            color="#b7b7bb"
          />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  arrow: { marginLeft: 12 },
  savedCount: {
    color: "#b7b7bb",
    fontSize: 17.5,
    marginRight: 8,
    marginTop: 5,
  },
});

EventStar.propTypes = {
  eventID: PropTypes.string.isRequired,
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
  origin: PropTypes.string.isRequired,
  discludeArrow: PropTypes.bool,
};

EventStar.defaultProps = {
  discludeArrow: false,
};
