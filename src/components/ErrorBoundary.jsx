import React, { Component } from "react";
import PropTypes from "prop-types";
import ErrorView from "./ErrorView";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    // It is useful if we encounter the error boundary to print out the error
    // for debugging
    // eslint-disable-next-line no-console
    console.error(error, errorInfo);
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;
    if (error) {
      return <ErrorView error={error} actionDescription="loading the app" />;
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

ErrorBoundary.defaultProps = {
  children: null,
};
