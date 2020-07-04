import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import colors from "../Colors";
import { P } from "../common/components/Text";
import { scale, verticalScale } from "../common/utils/scale";

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabs}>
      {state.routes.map((route, index) => {
        // Extract tab configuration data and navigator state
        const { options } = descriptors[route.key];

        const backupLabel =
          options.title !== undefined ? options.title : route.name;

        const label =
          options.tabBarLabel !== undefined ? options.tabBarLabel : backupLabel;

        const isFocused = state.index === index;

        const color = isFocused ? colors.primaryColor : colors.textColor.light;

        const onTabPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            accessibilityStates={isFocused ? ["selected"] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onTabPress}
            style={styles.tab}
            key={route.key}
          >
            {options.tabBarIcon({ color })}
            <P
              style={
                isFocused
                  ? [styles.tabText, styles.tabActiveText]
                  : styles.tabText
              }
            >
              {label}
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
  state: PropTypes.shape({
    routes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
    index: PropTypes.number.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
  }).isRequired,
  descriptors: PropTypes.objectOf(
    PropTypes.shape({
      title: PropTypes.string,
      tabBarLabel: PropTypes.string,
      tabBarIcon: PropTypes.node,
    }).isRequired
  ).isRequired,
};
