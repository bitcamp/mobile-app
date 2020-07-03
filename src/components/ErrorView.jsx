import React, { useState } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Image, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Images from "../../assets/imgs";
import { H2, H3 } from "./Text";
import colors from "./Colors";

/**
 * An attractive component used for displaying errors. Contains expandable error
 * information which can be used for debugging. TODO: determine if the extra error info should
 * be visible.
 * @param {Error|null} props.error The error object that is being monitored
 * @param {string} props.actionDescription The action that would be causing the error (e.g., fetching the events,
 * processing your _ request)
 * @param {boolean} props.fullScreen Whether the component will take up the whole screen (determines the
 * size of the error image)
 */
export default function ErrorView({ error, actionDescription, fullScreen }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    error && (
      <View style={styles.container}>
        <Image
          source={Images["error-logo"]}
          style={[styles.errorImg, !fullScreen && styles.smallerImg]}
        />
        <View>
          <H2 style={[styles.title, !fullScreen && styles.smallerTitle]}>
            Oops...
          </H2>
          <H3 style={[styles.description, !fullScreen && styles.smallerText]}>
            {`Looks like we encountered an error while ${actionDescription ||
              "loading the app"}. Sorry!`}
          </H3>
        </View>
        <TouchableOpacity
          onPress={() => setIsExpanded(oldIsExpanded => !oldIsExpanded)}
          style={styles.row}
        >
          <H3 style={[styles.expandText, !fullScreen && styles.smallerText]}>
            See More
          </H3>
          <Ionicons
            name="ios-arrow-forward"
            size={20}
            color={colors.primaryColor}
            style={[styles.expandIcon, isExpanded && styles.pointedDown]}
          />
        </TouchableOpacity>
        <H3 style={isExpanded ? styles.visible : styles.invisible}>
          {error.message}
        </H3>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 15,
  },
  description: {
    fontSize: 20,
    textAlign: "center",
  },
  errorImg: {
    alignSelf: "center",
    height: 200,
    resizeMode: "contain",
  },
  expandIcon: {
    color: colors.primaryColor,
    flexGrow: 0,
    paddingHorizontal: 5,
  },
  expandText: {
    color: colors.primaryColor,
    fontSize: 18,
  },
  invisible: {
    opacity: 0,
  },
  pointedDown: {
    transform: [{ rotate: "90deg" }],
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 15,
  },
  smallerImg: {
    height: 125,
  },
  smallerText: {
    fontSize: 16,
  },
  smallerTitle: {
    fontSize: 30,
  },
  title: {
    fontSize: 40,
    paddingVertical: 15,
    textAlign: "center",
  },
  visible: {
    opacity: 1,
  },
});

ErrorView.propTypes = {
  error: PropTypes.instanceOf(Error),
  actionDescription: PropTypes.string,
  fullScreen: PropTypes.bool,
};

ErrorView.defaultProps = {
  error: null,
  actionDescription: null,
  fullScreen: false,
};
