import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from "react-native";
import PropTypes from "prop-types";
import { Paper } from "react-native-paper";
import Images from "../../assets/imgs/index";
import { scale } from "../utils/scale";
import colors from "./Colors";
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

const Heading = ({ logo, style, children }) =>
  logo ? (
    <View style={[styles.headingContainer, style]}>
      <Image source={Images.bitcamp_logo} style={styles.logo} />
      <Heading style={styles.spacedHeading}>{children}</Heading>
    </View>
  ) : (
    <View style={styles.heading}>
      <H1 style={style}>{children}</H1>
    </View>
  );

const SubHeading = ({ style, children }) => (
  <View>
    <H2 style={[styles.subHeading, style]}>{children}</H2>
  </View>
);

const PaperSheet = ({ children }) => (
  <>
    {/* props.heading ? <H2 style={styles.paperHead}>{props.heading}</H2> : null */}
    <Paper style={styles.paper}>
      <View style={styles.paperBody}>{children}</View>
    </Paper>
  </>
);

const HorizontalLine = ({ style }) => (
  <View style={[styles.horizontalLine, style]} />
);

const Spacing = () => <View style={styles.spacing} />;

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
  headingContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  horizontalLine: {
    backgroundColor: colors.borderColor.light,
    height: 1,
  },
  loaderContainer: {
    backgroundColor: colors.backgroundColor.normal,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  logo: {
    height: 45,
    marginBottom: -10,
    width: 45,
  },
  padContainer: {
    flex: 1,
    paddingLeft: scale(15),
    paddingRight: scale(15),
  },
  paper: {
    backgroundColor: colors.backgroundColor.white,
  },
  paperBody: {
    padding: 15,
  },
  spacedHeading: {
    marginLeft: 12,
  },
  spacing: {
    height: scale(10),
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
  style: ViewPropTypes.style,
  logo: PropTypes.bool,
};
Heading.defaultProps = {
  style: null,
  logo: false,
};

SubHeading.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
};
SubHeading.defaultProps = {
  style: null,
};

PaperSheet.propTypes = {
  children: PropTypes.node.isRequired,
};

PadContainer.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
};
PadContainer.defaultProps = {
  style: null,
};

HorizontalLine.propTypes = {
  style: ViewPropTypes.style,
};
HorizontalLine.defaultProps = {
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
  Heading,
  SubHeading,
  PaperSheet,
  PadContainer,
  HorizontalLine,
  Spacing,
  CenteredActivityIndicator,
  Button,
};
