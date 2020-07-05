import React from "react";
import {
  View,
  ViewPropTypes,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Text,
} from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import PropTypes from "prop-types";
import { H3, P } from "../Text";
import colors from "../../../Colors";
import { scale } from "../../utils/scale";
import { noOp } from "../../utils/simpleFunctions";
import { requiredIf } from "../../utils/PropTypeUtils";

/* An alternative modal header desgin with a centered title and 
   configurable action text on the left and right */
const AltModalHeader = ({
  style,
  leftText,
  leftAction,
  leftTextStyle,
  title,
  rightText,
  rightAction,
  rightTextStyle,
}) => (
  <View style={{ ...styles.menu, style }}>
    <ConditionalSideText
      text={leftText}
      action={leftAction}
      textStyle={[styles.leftText, leftTextStyle]}
    />

    <H3 style={[styles.menuItem, styles.text, styles.title]}>{title}</H3>

    <ConditionalSideText
      text={rightText}
      action={rightAction}
      textStyle={rightTextStyle}
      containerStyle={styles.rightMenuItem}
    />
  </View>
);

/* A text componenent that acts like a button if a text property is supplied 
   or like an empty box otherwise */
const ConditionalSideText = ({ text, action, textStyle, containerStyle }) => (
  <View style={[styles.menuItem, containerStyle]}>
    {text ? (
      <TouchableOpacity
        onPress={action}
        hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
      >
        <P style={[styles.text, styles.link, textStyle]}>{text}</P>
      </TouchableOpacity>
    ) : null}
  </View>
);

const headerPadding = scale(15);
const styles = StyleSheet.create({
  leftText: {
    fontWeight: "normal",
  },
  link: {
    color: colors.primaryColor,
  },
  menu: {
    alignItems: "baseline",
    backgroundColor: colors.backgroundColor.normal,
    borderBottomWidth: 0.5,
    borderColor: colors.borderColor.normal,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: headerPadding,
    paddingTop:
      Platform.OS === "ios"
        ? headerPadding + getStatusBarHeight()
        : headerPadding,
    width: "100%",
  },
  menuItem: {
    flexDirection: "row",
    flex: 1,
  },
  rightMenuItem: {
    justifyContent: "flex-end",
  },
  text: {
    flex: 0,
    fontWeight: "bold",
    paddingHorizontal: scale(15), // Add in larger click area
  },
  title: {
    textAlign: "center",
  },
});

const propIsAFunction = (props, propName) =>
  typeof props[propName] === "function" && props[propName] !== noOp;

AltModalHeader.propTypes = {
  title: PropTypes.string.isRequired,
  leftText: PropTypes.string,
  leftAction: requiredIf(props => props.leftText, propIsAFunction),
  leftTextStyle: Text.propTypes.style,
  rightText: PropTypes.string,
  rightTextStyle: Text.propTypes.style,
  rightAction: requiredIf(props => props.rightText, propIsAFunction),
  style: ViewPropTypes.style,
};

AltModalHeader.defaultProps = {
  leftText: "",
  leftAction: noOp,
  leftTextStyle: null,
  rightText: "",
  rightAction: noOp,
  rightTextStyle: null,
  style: null,
};

ConditionalSideText.propTypes = {
  text: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  textStyle: Text.propTypes.style,
  containerStyle: ViewPropTypes.style,
};

ConditionalSideText.defaultProps = {
  containerStyle: null,
  textStyle: null,
};

export default AltModalHeader;
