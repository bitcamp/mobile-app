import React, { Component } from "react";
import {
  Animated,
  Keyboard,
  StyleSheet,
  TextInput,
  UIManager,
} from "react-native";
import PropTypes from "prop-types";
import { getDeviceHeight } from "../utils/sizing";

const { State: TextInputState } = TextInput;

/** Class adapted from https://gist.github.com/larkintuckerllc/15644c314207df00c212ecb14b981439#file-keyboardshift-js
    See this article for usage information: https://codeburst.io/react-native-keyboard-covering-inputs-72a9d3072689 */
export default class KeyboardShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shift: new Animated.Value(0),
    };
    this.animationDuration = 250;
    this.handleKeyboardDidShow = this.handleKeyboardDidShow.bind(this);
    this.handleKeyboardDidHide = this.handleKeyboardDidHide.bind(this);
  }

  componentDidMount() {
    this.keyboardDidShowSub = Keyboard.addListener(
      "keyboardDidShow",
      this.handleKeyboardDidShow
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      "keyboardDidHide",
      this.handleKeyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  handleKeyboardDidShow(event) {
    const { shift } = this.state;
    const windowHeight = getDeviceHeight();
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();

    UIManager.measure(
      currentlyFocusedField,
      (originX, originY, width, height, pageX, pageY) => {
        const fieldHeight = height;
        const fieldTop = pageY;
        const gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight);
        if (gap >= 0) {
          return;
        }

        const additionalOffset = fieldHeight / 2; // Add in extra spacing below the text input
        Animated.timing(shift, {
          toValue: gap - additionalOffset,
          duration: this.animationDuration,
          useNativeDriver: true,
        }).start();
      }
    );
  }

  handleKeyboardDidHide() {
    const { shift } = this.state;
    Animated.timing(shift, {
      toValue: 0,
      duration: this.animationDuration,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const { shift } = this.state;
    const { children } = this.props;
    return (
      <Animated.View
        style={[styles.container, { transform: [{ translateY: shift }] }]}
      >
        {children}
      </Animated.View>
    );
  }
}

KeyboardShift.propTypes = {
  children: PropTypes.node,
};

KeyboardShift.defaultProps = {
  children: null,
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
  },
});
