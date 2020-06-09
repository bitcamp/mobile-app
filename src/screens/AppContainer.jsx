/* eslint-disable react/prop-types */
// Disabling to avoid annoying error with icon props validation
// (see https://github.com/react-navigation/react-navigation/issues/710)
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { FontAwesome, Ionicons, EvilIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import colors from "../components/Colors";
import CustomTabBar from "../components/CustomTabBar";
import Home from "./Home";
import Mentors from "./Mentors";
import Profile from "./Profile";
import Schedule from "./Schedule";
import { scale } from "../utils/scale";

// Tab navigator or the main screen
const Tab = createBottomTabNavigator();

export default function AppContainer() {
  return (
    <SafeAreaView style={styles.appBackground}>
      <Tab.Navigator
        initialRouteName="home"
        tabBar={({ state, descriptors, navigation }) => (
          <CustomTabBar {...{ state, descriptors, navigation }} />
        )}
      >
        {/* Tab header configuration can be found in `Header.jsx` */}
        <Tab.Screen
          name="home"
          component={Home}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome name="home" size={scale(25)} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="schedule"
          component={Schedule}
          options={{
            tabBarIcon: ({ color }) => (
              <EvilIcons name="calendar" size={scale(32)} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="mentors"
          component={Mentors}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="ios-people"
                size={scale(32)}
                color={color}
                style={{
                  marginTop: scale(-5),
                  marginBottom: scale(-2.5),
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="ios-person" size={scale(25)} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appBackground: {
    backgroundColor: colors.backgroundColor.normal,
    flex: 1,
  },
});
