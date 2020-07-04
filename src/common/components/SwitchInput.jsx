import React from "react";
import {
  TouchableOpacity,
  Switch,
  StyleSheet,
  ViewPropTypes,
  Text,
} from "react-native";
import PropTypes from "prop-types";
import { P } from "./Text";
import colors from "../../Colors";

export default function SwitchInput({
  style,
  isDisabled,
  onPress,
  text,
  textStyle,
  value,
}) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => {
        if (!isDisabled) {
          onPress();
        }
      }}
      activeOpacity={1}
    >
      <P style={textStyle}>{text}</P>
      <Switch
        trackColor={colors.primaryColor}
        value={value}
        onValueChange={onPress}
        disabled={isDisabled}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

SwitchInput.propTypes = {
  style: ViewPropTypes.style,
  onPress: PropTypes.func.isRequired,
  textStyle: Text.propTypes.style,
  text: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
};

SwitchInput.defaultProps = {
  isDisabled: false,
  style: null,
  textStyle: null,
};
