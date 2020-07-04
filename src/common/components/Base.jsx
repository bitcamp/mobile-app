import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Text,
} from "react-native";
import PropTypes from "prop-types";
import { scale } from "../utils/scale";
import colors from "../../Colors";
import { H1, H2, H3 } from "./Text";

const PlainViewContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

const ViewContainer = ({ style, children }) => (
  <PlainViewContainer>
    <ScrollView keyboardShouldPersistTaps="handled" style={styles.flex}>
      <View style={[styles.container, style]}>{children}</View>
    </ScrollView>
  </PlainViewContainer>
);

const PadContainer = ({ style, children }) => (
  <View style={[styles.padContainer, style]}>{children}</View>
);

const Heading = ({ style, children }) => (
  <View style={styles.heading}>
    <H1 style={style}>{children}</H1>
  </View>
);

const SubHeading = ({ style, children }) => (
  <View>
    <H2 style={(styles.subHeading, style)}>{children}</H2>
  </View>
);

const CenteredActivityIndicator = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color={colors.primaryColor} />
  </View>
);

const Button = ({ onPress, style, text }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.button, style]}>
      <H3 style={styles.buttonText}>{text}</H3>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryColor,
    borderRadius: 4,
    marginLeft: 20,
    marginRight: 20,
    padding: 8,
  },
  buttonText: {
    color: colors.textColor.primary,
    textAlign: "center",
  },
  container: {
    backgroundColor: colors.backgroundColor.normal,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  heading: {
    flexDirection: "row",
    marginBottom: scale(15),
    paddingTop: scale(25),
  },
  loaderContainer: {
    backgroundColor: colors.backgroundColor.normal,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  padContainer: {
    flex: 1,
    paddingLeft: scale(15),
    paddingRight: scale(15),
  },
  subHeading: {
    color: colors.textColor.light,
    marginBottom: scale(35),
  },
});

PlainViewContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

ViewContainer.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
};
ViewContainer.defaultProps = {
  style: null,
};

Heading.propTypes = {
  children: PropTypes.node.isRequired,
  style: Text.propTypes.style,
};
Heading.defaultProps = {
  style: null,
};

SubHeading.propTypes = {
  children: PropTypes.node.isRequired,
  style: Text.propTypes.style,
};
SubHeading.defaultProps = {
  style: null,
};

PadContainer.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
};
PadContainer.defaultProps = {
  style: null,
};

Button.propTypes = {
  style: ViewPropTypes.style,
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};
Button.defaultProps = {
  style: null,
};

export {
  PlainViewContainer,
  ViewContainer,
  PadContainer,
  Heading,
  SubHeading,
  CenteredActivityIndicator,
  Button,
};
