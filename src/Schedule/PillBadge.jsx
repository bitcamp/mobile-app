import React from "react";
import { StyleSheet, View, ViewPropTypes } from "react-native";
import PropTypes from "prop-types";
import { scale } from "../common/utils/scale";
import { BaseText } from "../common/components/Text";
import { EVENT_CATEGORIES } from "../hackathon.config";

export default function PillBadge({ category, isBigger, style }) {
  return (
    <View
      style={[
        styles.container,
        styles.width,
        {
          backgroundColor: badgeStyles[category].backgroundColor,
        },
        isBigger && styles.extraPadding,
        style,
      ]}
    >
      <BaseText
        style={[
          styles.width,
          styles.text,
          { color: badgeStyles[category].textColor },
          isBigger && styles.largeText,
        ]}
      >
        {category.toUpperCase()}
      </BaseText>
    </View>
  );
}

PillBadge.propTypes = {
  category: PropTypes.oneOf(EVENT_CATEGORIES).isRequired,
  style: ViewPropTypes.style,
  isBigger: PropTypes.bool,
};

PillBadge.defaultProps = {
  style: null,
  isBigger: false,
};

const badgeColors = {
  red: "#ff3b30",
  yellow: "#ff9500",
  green: "#4fd964",
  blue: "#007aff",
  turquoise: "#00d4ff",
  purple: "#d028ff",
};

const bgTransparencyInHex = "40";

const badgeStyles = {
  "main-event": {
    textColor: badgeColors.green,
    backgroundColor: `${badgeColors.green}${bgTransparencyInHex}`,
  },
  "mini-event": {
    textColor: badgeColors.yellow,
    backgroundColor: `${badgeColors.yellow}${bgTransparencyInHex}`,
  },
  food: {
    textColor: badgeColors.red,
    backgroundColor: `${badgeColors.red}${bgTransparencyInHex}`,
  },
  workshop: {
    textColor: badgeColors.purple,
    backgroundColor: `${badgeColors.purple}${bgTransparencyInHex}`,
  },
  sponsored: {
    textColor: badgeColors.blue,
    backgroundColor: `${badgeColors.blue}${bgTransparencyInHex}`,
  },
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },
  extraPadding: {
    marginTop: 3,
    paddingHorizontal: scale(3),
  },
  largeText: {
    fontSize: scale(12),
  },
  text: {
    fontWeight: "bold",
    paddingBottom: 1,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 1,
  },
  width: {
    alignSelf: "flex-start",
    borderRadius: 3,
  },
});
