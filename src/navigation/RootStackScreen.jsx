import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Login/Login";
import AppLoadingScreen from "./AppLoadingScreen";
import AppContainer from "./AppContainer";
import NavigationHeader from "./NavigationHeader";
import MapModal from "../Home/MapModal";
import SearchModal from "../Schedule/SearchModal";
import EventModal from "../Schedule/EventModal";
import QuestionModal from "../Mentors/QuestionModal";

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator
      initialRouteName="loading"
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="loading" component={AppLoadingScreen} />
      <MainStack.Screen name="login" component={Login} />
      <MainStack.Screen
        name="app"
        component={AppContainer}
        options={({ route, navigation }) => ({
          headerShown: true,
          header: () => <NavigationHeader {...{ route, navigation }} />,
        })}
      />
    </MainStack.Navigator>
  );
}

export default function RootStackScreen() {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="main"
        mode="modal"
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="main" component={MainStackScreen} />
        <RootStack.Screen name="map modal" component={MapModal} />
        <RootStack.Screen name="search modal" component={SearchModal} />
        <RootStack.Screen name="event modal" component={EventModal} />
        <RootStack.Screen name="question modal" component={QuestionModal} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
