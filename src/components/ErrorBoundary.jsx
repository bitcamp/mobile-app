import React, { Component } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import { H1 } from "./Text";
import { scale } from "../utils/scale";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // It is useful if we encounter the error boundary to print out the error
    // for debugging
    // eslint-disable-next-line no-console
    console.error(error, errorInfo);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      return (
        <View style={styles.fullScreen}>
          <H1 style={styles.errorMessage}>Encountered a fatal error.</H1>
          <H1 style={styles.errorMessage}> Please reload the app.</H1>
        </View>
      );
    }

    return children;
  }
}

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: scale(25),
    textAlign: "center",
  },
  fullScreen: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

ErrorBoundary.defaultProps = {
  children: null,
};
