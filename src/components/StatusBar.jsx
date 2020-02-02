import React from "react";
import { View, StatusBar, Platform } from "react-native";
import PropTypes from "prop-types";

// here, we add the spacing for iOS
// and pass the rest of the props to React Native's StatusBar

export default function StatusBarWithSpacing({ backgroundColor, ...props }) {
  const height = Platform.OS === "ios" ? 20 : 0;

  return (
    <View style={{ height, backgroundColor }}>
      <StatusBar {...props} />
    </View>
  );
}

StatusBarWithSpacing.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
};
