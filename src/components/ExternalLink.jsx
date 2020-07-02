import React from "react";
import { Alert, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { Linking } from "expo";
import { BaseText } from "./Text";
import colors from "./Colors";
import { noOp } from "../utils/simpleFunctions";

export default class ExternalLink extends React.Component {
  openURL() {
    // TODO: update to follow the expo API here:
    // https://docs.expo.io/versions/v33.0.0/workflow/linking/
    const { url } = this.props;
    Linking.openURL(url).catch(() => this.displayError(url));
  }

  displayError() {
    const { url } = this.props;
    Alert.alert(
      "Sorry, something went wrong",
      `Unable to open ${url}`,
      [{ text: "OK", onPress: noOp }],
      { cancelable: false }
    );
  }

  render() {
    const { text, url } = this.props;

    return (
      <TouchableOpacity
        onPress={() => this.openURL(url)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <BaseText style={styles.link}>{text}</BaseText>
      </TouchableOpacity>
    );
  }
}

ExternalLink.propTypes = {
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

const styles = {
  link: {
    color: colors.primaryColor,
  },
};
