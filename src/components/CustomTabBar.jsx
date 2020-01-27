import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from "react-native";
import { Ionicons, FontAwesome, EvilIcons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import colors from "./Colors";
import { P } from "./Text";
import { scale, verticalScale } from "../utils/scale";
import { noop } from "../utils/PropTypeUtils";

const LABELS = ["Home", "Schedule", "Mentors", "Profile"];

export default function CustomTabBar({ style, tabs, activeTab, goToPage }) {
  return (
    <View style={[styles.tabs, style]}>
      {tabs.map((tab, i) => {
        const color =
          activeTab === i ? colors.primaryColor : colors.textColor.light;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => goToPage(i)}
            style={styles.tab}
          >
            {
              {
                home: (
                  <FontAwesome name="home" size={scale(25)} color={color} />
                ),
                schedule: (
                  <EvilIcons name="calendar" size={scale(32)} color={color} />
                ),
                expo: (
                  <Ionicons name="md-code" size={scale(25)} color={color} />
                ),
                mentors: (
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
                profile: (
                  <Ionicons name="ios-person" size={scale(25)} color={color} />
                ),
              }[tab]
            }
            <P
              style={
                activeTab === i
                  ? [styles.tabText, styles.tabActiveText]
                  : styles.tabText
              }
            >
              {LABELS[i]}
            </P>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: verticalScale(5),
  },
  tabActiveText: {
    color: colors.primaryColor,
  },
  tabText: {
    color: "#8E8E93",
    fontFamily: "System",
    fontSize: scale(13),
    fontWeight: "400",
    marginTop: verticalScale(1),
  },
  tabs: {
    backgroundColor: colors.backgroundColor.light,
    flexDirection: "row",
  },
});

CustomTabBar.propTypes = {
  style: ViewPropTypes.style,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeTab: PropTypes.number.isRequired,
  goToPage: PropTypes.func,
};

CustomTabBar.defaultProps = {
  style: null,
  goToPage: noop,
};
