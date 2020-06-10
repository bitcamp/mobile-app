import React from "react";
import { ViewPropTypes, StyleSheet, View, ScrollView } from "react-native";
import PropTypes from "prop-types";
import colors from "../Colors";
import { scale } from "../../utils/scale";

/* A <Modal> wrapper that uses a standard set of animations and colors */
const FullScreenModal = ({
  header,
  shouldntScroll,
  style,
  contentStyle,
  children,
}) => (
  <View style={[styles.modal, style]}>
    {header}
    {shouldntScroll ? (
      <View style={[styles.content, contentStyle]}>{children}</View>
    ) : (
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={[styles.content, contentStyle]}>{children}</View>
      </ScrollView>
    )}
  </View>
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: scale(15),
    paddingTop: 0,
  },
  modal: {
    backgroundColor: colors.backgroundColor.normal,
    flex: 1,
    margin: 0,
  },
});

FullScreenModal.propTypes = {
  contentStyle: ViewPropTypes.style,
  header: PropTypes.element,
  shouldntScroll: PropTypes.bool,
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

FullScreenModal.defaultProps = {
  contentStyle: null,
  header: null,
  shouldntScroll: false,
  children: null,
  style: null,
};

export default FullScreenModal;
