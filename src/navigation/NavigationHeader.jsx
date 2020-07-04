import React from "react";
import { View, Image, StyleSheet, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SimpleLineIcons, FontAwesome } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import colors from "../Colors";
import { H1 } from "../common/components/Text";
import Images from "../../assets/imgs";
import { HACKATHON_NAME } from "../hackathon.config";

const iconProps = { size: 30, color: colors.primaryColor };

// What the header should look like for
const tabs = {
  home: {
    title: HACKATHON_NAME.toLowerCase(),
    modal: {
      icon: <FontAwesome name="map" {...iconProps} />,
      route: "map modal",
    },
  },
  schedule: {
    title: "Schedule",
    modal: {
      icon: <SimpleLineIcons name="magnifier" {...iconProps} />,
      route: "search modal",
    },
  },
  mentors: {
    title: "Mentors",
  },
  profile: {
    title: "Profile",
  },
};

/**
 * The header for the app container. The header title and
 * right icon adjusts based on the current tab.
 */
export default function NavigationHeader({ route, navigation }) {
  // Access the tab navigator's state using `route.state`. Default to "home"
  const currentTabName = route.state
    ? route.state.routes[route.state.index].name
    : "home";

  const currentTab = tabs[currentTabName];

  return (
    <View style={styles.header}>
      <View style={styles.leftHeader}>
        <Image source={Images["hackathon-logo"]} style={styles.logo} />
        <H1 style={styles.title}>{currentTab.title}</H1>
      </View>
      <View>
        {currentTab.modal && (
          <TouchableOpacity
            onPress={() => navigation.navigate(currentTab.modal.route)}
            activeOpacity={0.7}
          >
            {currentTab.modal.icon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

NavigationHeader.propTypes = {
  route: PropTypes.shape({
    state: PropTypes.shape({
      routes: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
        })
      ).isRequired,
      index: PropTypes.number.isRequired,
    }),
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingTop: Platform.OS === "ios" ? 10 + getStatusBarHeight() : 10,
    borderBottomWidth: 0.5,
    backgroundColor: colors.backgroundColor.light,
    borderColor: colors.borderColor.normal,
  },
  leftHeader: {
    alignItems: "center",
    flexDirection: "row",
  },
  logo: {
    height: 50,
    width: 50,
  },
  title: {
    paddingLeft: 15,
  },
});
