import React, { Component } from "react";
import { YellowBox, AsyncStorage } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import * as firebase from "firebase";
import Login from "./screens/Login";
import AppContainer from "./screens/AppContainer";
import { CenteredActivityIndicator } from "./components/Base";
import { firebaseConfig } from "../config";

// TODO: add in react-native-screens optimization

// NOTE dangerously ignore deprecated warning for now
YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader",
  "Setting a timer",
  "Warning: Can't",
]);

// Firebase initialization
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: undefined,
    };
  }

  componentDidMount() {
    this.loadUserInfo();
  }

  async loadUserInfo() {
    AsyncStorage.getItem("USER_DATA_STORE").then(userInfo => {
      this.setState({
        isLoggedIn: userInfo !== null,
      });
    });
  }

  render() {
    // TODO: move this into app container so we don't need the loading indivator here?
    const { isLoggedIn } = this.state;

    if (isLoggedIn === undefined) {
      return <CenteredActivityIndicator />;
    }
    // TODO: strip out of render
    const AppNavigator = createStackNavigator(
      {
        Login: { screen: Login },
        AppContainer: { screen: AppContainer },
      },
      {
        initialRouteName: isLoggedIn === false ? "Login" : "AppContainer",
      }
    );
    const NavContainer = createAppContainer(AppNavigator);
    return <NavContainer screenProps={this.props} />;
  }
}
