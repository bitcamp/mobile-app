import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { Ionicons } from "@expo/vector-icons";
import { scale } from "../../utils/scale";
import colors from "../Colors";
import EventStar from "../events/EventStar";
import EventsManager from "../../events/EventsManager";
import { H3 } from "../Text";
import { requiredIf } from "../../utils/PropTypeUtils";

export default class ModalHeader extends Component {
  componentWillUnmount() {
    const { heart, eventManager } = this.props;
    if (heart) {
      eventManager.removeHeartListener(this.myStar);
    }
  }

  render() {
    const {
      onBackButtonPress,
      heart,
      noArrow,
      eventID,
      eventManager,
      origin,
    } = this.props;

    return (
      <View style={styles.modalHeader}>
        <View style={styles.modalHeaderNav}>
          <TouchableOpacity
            style={styles.backButtonClickArea}
            onPress={onBackButtonPress}
          >
            <View style={styles.backIconContainer}>
              <Ionicons
                name="ios-arrow-back"
                size={35}
                color={colors.primaryColor}
                style={styles.backIcon}
              />
              <H3 style={styles.backButtonLocation}>{origin}</H3>
            </View>
          </TouchableOpacity>
          {heart && (
            <View style={styles.favoriteButton}>
              <EventStar
                ref={myStar => {
                  this.myStar = myStar;
                  eventManager.registerHeartListener(myStar);
                }}
                eventID={eventID}
                eventManager={eventManager}
                discludeArrow={noArrow}
                origin={origin}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backButtonClickArea: {
    marginLeft: -10,
    padding: scale(4),
  },
  backButtonLocation: {
    color: colors.primaryColor,
    fontSize: 20,
  },
  backIcon: {
    paddingRight: 7,
  },
  backIconContainer: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  favoriteButton: {
    alignItems: "center",
    flexDirection: "row",
  },
  modalHeader: {
    paddingBottom: scale(4),
    paddingHorizontal: scale(15),
    paddingTop:
      Platform.OS === "ios" ? scale(4) + getStatusBarHeight() : scale(4),
  },
  modalHeaderNav: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

ModalHeader.propTypes = {
  onBackButtonPress: PropTypes.func.isRequired,
  heart: PropTypes.bool,
  noArrow: PropTypes.bool,
  eventID: requiredIf(
    props => props.heart,
    (props, propName) => typeof props[propName] === "string"
  ),
  eventManager: requiredIf(
    props => props.heart,
    (props, propName) => props[propName] instanceof EventsManager
  ),
  origin: PropTypes.string.isRequired,
};

ModalHeader.defaultProps = {
  heart: false,
  noArrow: false,
  eventManager: null,
  eventID: null,
};
