import React from "react";
import { YellowBox } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Login from "./screens/Login";
import AppLoadingScreen from "./screens/AppLoadingScreen";
import AppContainer from "./screens/AppContainer";

// TODO: add in react-native-screens optimization

// NOTE dangerously ignore deprecated warning for now
YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader",
  "Setting a timer",
  "Warning: Can't",
]);

const AppNavigator = createStackNavigator(
  {
    Loading: { screen: AppLoadingScreen },
    Login: { screen: Login },
    AppContainer: { screen: AppContainer },
  },
  {
    initialRouteName: "Loading",
  }
);

const NavContainer = createAppContainer(AppNavigator);

export default function App(props) {
  return <NavContainer screenProps={props} />;
}
