import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-tiny-toast";
import { H3 } from "../Text";
import colors from "../Colors";
import { useFollowingActions } from "../../contexts/FollowingContext/FollowingHooks";

export default function EventStar({ eventId, discludeArrow }) {
  const {
    toggleFollowStatus,
    isUserFollowing,
    getFollowCount,
  } = useFollowingActions();

  // Toggle the following state when the star is pressed
  const handleToggleAction = useCallback(() => {
    toggleFollowStatus({ eventId }).catch(e => {
      const toDisplay = e.message.includes("Still processing")
        ? e.message
        : `Unable to ${isUserFollowing(eventId) ? "un" : ""}follow the event`;

      Toast.show(toDisplay, Toast.LONG);
    });
  }, [eventId, isUserFollowing, toggleFollowStatus]);

  return (
    <>
      <H3 style={styles.savedCount}>{getFollowCount(eventId)}</H3>
      <TouchableOpacity onPress={handleToggleAction}>
        <Ionicons
          name="ios-star"
          size={30}
          color={
            isUserFollowing(eventId)
              ? colors.starColor.selected
              : colors.starColor.unselected
          }
        />
      </TouchableOpacity>

      {// TODO: remove this from this component and put it into the event description
      !discludeArrow && (
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
  eventId: PropTypes.number.isRequired,
  discludeArrow: PropTypes.bool,
};

EventStar.defaultProps = {
  discludeArrow: false,
};
