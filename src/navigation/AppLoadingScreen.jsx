import React, { Component } from "react";
import PropTypes from "prop-types";
import { AsyncStorage } from "react-native";
import { CenteredActivityIndicator } from "../common/components/Base";

export default class AppLoadingScreen extends Component {
  componentDidMount() {
    this.loadUserInfo();
  }

  async loadUserInfo() {
    const {
      navigation: { navigate },
    } = this.props;

    try {
      const userInfo = await AsyncStorage.getItem("USER_DATA_STORE");

      if (userInfo !== null) {
        navigate("app");
      } else {
        navigate("login");
      }
    } catch (error) {
      // Delete the old storage and go to the login screen
      AsyncStorage.clear();
      navigate("login");
    }
  }

  render() {
    return <CenteredActivityIndicator />;
  }
}

AppLoadingScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired })
    .isRequired,
};
