import React from "react";
import Modal from "react-native-modal";
import { ViewPropTypes, StyleSheet, View, ScrollView } from "react-native";
import PropTypes from "prop-types";
import { colors } from "../Colors";
import { scale } from "../../utils/scale";

/* A <Modal> wrapper that uses a standard set of animations and colors */
const FullScreenModal = ({
  header,
  shouldntScroll,
  contentStyle,
  children,
  ...props
}) => (
  <Modal
    backdropColor={colors.backgroundColor.normal}
    backdropOpacity={1}
    animationIn="fadeInUp"
    animationOut="fadeOutDown"
    animationInTiming={250}
    animationOutTiming={300}
    backdropTransitionInTiming={250}
    backdropTransitionOutTiming={300}
    avoidKeyboard
    style={styles.modal}
    {...props}
  >
    {header}
    {shouldntScroll ? (
      <View style={[styles.content, contentStyle]}>{children}</View>
    ) : (
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={[styles.content, contentStyle]}>{children}</View>
      </ScrollView>
    )}
  </Modal>
);

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.backgroundColor.normal,
    flex: 1,
    padding: scale(15),
    paddingTop: 0,
  },
  modal: {
    margin: 0,
  },
});

FullScreenModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onBackButtonPress: PropTypes.func.isRequired,
  contentStyle: ViewPropTypes.style,
  header: PropTypes.element,
  shouldntScroll: PropTypes.bool,
  children: PropTypes.node,
};

FullScreenModal.defaultProps = {
  contentStyle: null,
  header: null,
  shouldntScroll: false,
  children: null,
};

export default FullScreenModal;
