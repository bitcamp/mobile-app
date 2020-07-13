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
import { useAuthState } from "../contexts/AuthContext/AuthHooks";

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();

/**
 * Displays the login, loading, or main app screen based on the current
 * auth state
 */
function MainStackScreen() {
  const { isLoadingToken, user } = useAuthState();

  // Display the main app screen when the user is loaded
  const mainScreen = user ? (
    <MainStack.Screen
      name="app"
      component={AppContainer}
      options={({ route, navigation }) => ({
        headerShown: true,
        header: () => <NavigationHeader {...{ route, navigation }} />,
      })}
    />
  ) : (
    <MainStack.Screen name="login" component={Login} />
  );

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isLoadingToken ? (
        <MainStack.Screen name="loading" component={AppLoadingScreen} />
      ) : (
        mainScreen
      )}
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
