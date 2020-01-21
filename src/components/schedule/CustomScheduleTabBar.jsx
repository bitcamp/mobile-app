import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../Colors";
import { scale } from "../../utils/scale";
import { BaseText } from "../Text";

export default class CustomScheduleTabBar extends Component {
  constructor(props) {
    super(props);
    this.setAnimationValue = this.setAnimationValue.bind(this);
  }

  componentDidMount() {
    const { scrollValue } = this.props;
    this._listener = scrollValue.addListener(this.setAnimationValue);
  }

  setAnimationValue({ value }) {}

  render() {
    if (this.props.tabs.length === 0) {
      return <React.Fragment key="EMPTY SEARCH TAB" />;
    }
    return (
      <View style={[styles.tabs, this.props.style]}>
        {this.props.tabs.map((tab, i) => {
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => this.props.goToPage(i)}
              style={[
                styles.tab,
                this.props.activeTab === i
                  ? styles.activetab
                  : styles.inactivetab,
                tab === "ios-star" ? styles.star : styles.weekdays,
              ]}
            >
              {tab !== "ios-star" ? (
                tab !== "Parking" ? (
                  <BaseText
                    style={[
                      styles.text,
                      this.props.activeTab === i && styles.textActive,
                    ]}
                  >
                    {tab}
                  </BaseText>
                ) : (
                  <Ionicons
                    name="md-car"
                    size={22}
                    color={
                      this.props.activeTab === i
                        ? colors.primaryColor
                        : colors.textColor.light
                    }
                  />
                )
              ) : (
                <Icon
                  name={tab}
                  size={27.5}
                  color={
                    this.props.activeTab === i
                      ? colors.primaryColor
                      : colors.textColor.light
                  }
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
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
  weekdays: {
    flex: 1,
  },
});
