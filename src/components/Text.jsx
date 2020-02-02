import React from "react";
import { Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import colors from "./Colors";
import { scale } from "../utils/scale";

const H1 = ({ style, children, ...props }) => (
  <Text {...props} style={[styles.text, styles.h1, style]}>
    {children}
  </Text>
);
const H2 = ({ style, children, ...props }) => (
  <Text {...props} style={[styles.text, styles.h2, style]}>
    {children}
  </Text>
);
const H3 = ({ style, children, ...props }) => (
  <Text {...props} style={[styles.text, styles.h3, style]}>
    {children}
  </Text>
);
const H4 = ({ style, children, ...props }) => (
  <Text {...props} style={[styles.text, styles.h4, style]}>
    {children}
  </Text>
);
const H5 = ({ style, children, ...props }) => (
  <Text {...props} style={[styles.text, styles.h5, style]}>
    {children}
  </Text>
);
const H6 = ({ style, children, ...props }) => (
  <Text {...props} style={[styles.text, styles.h6, style]}>
    {children}
  </Text>
);
const P = ({ style, children, ...props }) => (
  <Text {...props} style={[styles.text, styles.p, style]}>
    {children}
  </Text>
);
const BaseText = ({ style, children, ...props }) => (
  <Text {...props} style={[styles.text, style]}>
    {children}
  </Text>
);

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

H1.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.node,
};
H1.defaultProps = {
  style: null,
  children: null,
};

H2.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.node,
};
H2.defaultProps = {
  style: null,
  children: null,
};

H3.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.node,
};
H3.defaultProps = {
  style: null,
  children: null,
};

H4.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.node,
};
H4.defaultProps = {
  style: null,
  children: null,
};

H5.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.node,
};
H5.defaultProps = {
  style: null,
  children: null,
};

H6.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.node,
};
H6.defaultProps = {
  style: null,
  children: null,
};

P.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.node,
};
P.defaultProps = {
  style: null,
  children: null,
};

BaseText.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.node,
};
BaseText.defaultProps = {
  style: null,
  children: null,
};

export { H1, H2, H3, H4, H5, H6, P, BaseText };

// TODO: investigate why this function, which is meant to reduce
// redundancy in this file causes the app to fatally crash
// Creates a text component with the specified style applied

// const createTextComponent = textStyle => ({ style, children, ...props }) => (
//   <Text {...props} style={[styles.text, textStyle, style]}>
//     {children}
//   </Text>
// );
// usage: const H1 = createTextComponent(styles.h1);
