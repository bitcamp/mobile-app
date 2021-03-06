import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ViewPropTypes,
} from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../Colors";
import { scale } from "../utils/scale";
import { BaseText } from "./Text";

/**
 * TODO: this component has a bunch of props, but doesn't seem to use
 * them at all. We have to check to see if those props are at all useful
 *
 * TODO: This component is incredibly slow and includes many hardcoded
 * styles and input parameters. It should accept better props to better
 * deal with icon tab labels
 */
export default function SwipableTabBar({ tabs, style, goToPage, activeTab }) {
  if (tabs.length === 0) {
    return <React.Fragment key="EMPTY SEARCH TAB" />;
  }
  return (
    <View style={[styles.tabs, style]}>
      {tabs.map((tab, i) => {
        let buttonIcon;
        if (tab === "saved") {
          buttonIcon = (
            <Icon
              name="ios-star"
              size={27.5}
              color={
                activeTab === i ? colors.primaryColor : colors.textColor.light
              }
            />
          );
        } else if (tab === "Parking") {
          buttonIcon = (
            <Ionicons
              name="md-car"
              size={22}
              color={
                activeTab === i ? colors.primaryColor : colors.textColor.light
              }
            />
          );
        } else {
          buttonIcon = (
            <View style={styles.textContainer}>
              <BaseText
                style={[styles.text, activeTab === i && styles.textActive]}
              >
                {tab}
              </BaseText>
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={tab}
            onPress={() => goToPage(i)}
            style={[
              styles.tab,
              activeTab === i ? styles.activetab : styles.inactivetab,
              tab === "ios-star" ? styles.star : styles.weekdays,
            ]}
          >
            {buttonIcon}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  activetab: {
    borderBottomColor: colors.primaryColor,
  },
  inactivetab: {
    borderBottomColor: "transparent",
  },
  star: {
    width: 70,
  },
  tab: {
    alignItems: "center",
    borderBottomWidth: 5,
    justifyContent: "center",
    paddingVertical: scale(8),
  },
  tabs: {
    borderBottomColor: "rgba(0,0,0,0.05)",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  text: {
    color: colors.textColor.light,
    fontSize: scale(15),
  },
  textActive: {
    color: colors.primaryColor,
    fontWeight: "bold",
  },
  textContainer: {
    height: 27,
    justifyContent: "center",
  },
  weekdays: {
    flex: 1,
  },
});

SwipableTabBar.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  style: ViewPropTypes.style,
  goToPage: PropTypes.func.isRequired,
  activeTab: PropTypes.number.isRequired,
};

SwipableTabBar.defaultProps = {
  style: null,
};
