import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Login";
import AppLoadingScreen from "./screens/AppLoadingScreen";
import AppContainer from "./screens/AppContainer";
import Header from "./components/Header";
import MapModal from "./screens/modals/MapModal";
import SearchModal from "./screens/modals/SearchModal";
import EventModal from "./screens/modals/EventModal";
import QuestionModal from "./screens/modals/QuestionModal";

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
          header: () => <Header {...{ route, navigation }} />,
        })}
      />
    </MainStack.Navigator>
  );
}

export default function App() {
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
