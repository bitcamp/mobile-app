import React from "react";
import { Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import colors from "./Colors";
import { scale } from "../utils/scale";

const styles = StyleSheet.create({
  h1: {
    color: colors.primaryColor,
    fontFamily: "Aleo-Bold",
    fontSize: scale(32),
    fontWeight: "normal",
  },
  h2: {
    fontSize: scale(18),
    fontWeight: "bold",
  },
  h3: {
    fontSize: scale(15),
  },
  h4: {
    fontSize: scale(14),
  },
  h5: {
    fontSize: scale(13),
  },
  h6: {
    fontSize: scale(12),
  },
  p: {
    fontSize: scale(14),
  },
  text: {
    color: colors.textColor.normal,
    fontFamily: "System",
    fontWeight: "normal",
  },
});

// Creates a text component with the specified style applied
const createTextComponent = textStyle => ({ style, children, ...props }) => (
  <Text {...props} style={[styles.text, textStyle, style]}>
    {children}
  </Text>
);

export const H1 = createTextComponent(styles.h1);
export const H2 = createTextComponent(styles.h2);
export const H3 = createTextComponent(styles.h3);
export const H4 = createTextComponent(styles.h4);
export const H5 = createTextComponent(styles.h5);
export const H6 = createTextComponent(styles.h6);
export const P = createTextComponent(styles.p);
export const BaseText = createTextComponent(null);

const components = [H1, H2, H3, H4, H5, H6, P, BaseText];
components.forEach(component => {
  component.propTypes = {
    style: Text.propTypes.style,
    children: PropTypes.node,
  };
  component.defaultProps = {
    style: null,
    children: null,
  };
});
