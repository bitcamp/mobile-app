import React from "react";
import PropTypes from "prop-types";

import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ViewPropTypes,
} from "react-native";

import colors from "../Colors";
import { H2 } from "../Text";

export default function ScheduleSceneTabBar({
  style,
  tabs,
  activeTab,
  goToSection,
}) {
  return (
    <FlatList
      style={[styles.tabs, style]}
      data={tabs}
      renderItem={tabObj => {
        const isActive = activeTab === tabObj.index;
        return (
          <TouchableOpacity
            onPress={() => goToSection(tabObj.index)}
            style={[styles.tab, styles.tabActive]}
          >
            <H2 style={isActive ? styles.activeText : styles.inactiveText}>
              {tabObj.item}&nbsp;
            </H2>
            {/* <View style={isActive ? styles.bottomBorder : styles.bottomBorderInactive }></View> */}
          </TouchableOpacity>
        );
      }}
      ItemSeparatorComponent={() => <H2>&nbsp;&nbsp;</H2>}
      horizontal
      keyExtractor={item => item}
    />
  );
}

ScheduleSceneTabBar.propTypes = {
  goToSection: PropTypes.func.isRequired,
  activeTab: PropTypes.number.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  style: ViewPropTypes.style,
};

ScheduleSceneTabBar.defaultProps = {
  style: null,
};

const styles = StyleSheet.create({
  activeText: {
    color: colors.textColor.normal,
  },
  inactiveText: {
    color: colors.textColor.light,
  },
  // bottomBorderInactive: {
  //   // alignSelf: 'stretch',
  //   // height: 2,
  //   // marginBottom: 10,
  //   // marginTop: 2,
  // },
  // bottomBorder: {
  //   // alignSelf: 'stretch',
  //   // backgroundColor: colors.white,
  //   // height: 2,
  //   // marginTop: 2,
  //   // marginBottom: 10,
  // },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 40,
    // marginVertical: 10,
  },
  tabs: {
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    flexDirection: "row",
  },
});
