import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import Entypo from 'react-native-vector-icons/Entypo'
import moment from 'moment';
import { colors } from './Colors';
import { P } from './Text';
import { scale, verticalScale } from '../utils/scale';

const LABELS = ["Home", "Schedule", "Mentors", "Profile"];

class CustomTabBar extends Component {
  render() {
    return (
      <View style={[styles.tabs, this.props.style]}>
        {this.props.tabs.map((tab, i) => {
          let color = (this.props.activeTab === i ? colors.primaryColor : colors.textColor.light);
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => this.props.goToPage(i)}
              style={styles.tab}
            >
            {
              {
                'home': <FontAwesome name='home' size={scale(25)} color={color}/>,
                'schedule': <EvilIcons name='calendar' size={scale(32)} color={color}/>,
                'expo': <Entypo name='code' size={scale(25)} color={color}/>,
                'mentors': <Ionicons name='ios-people' size={scale(32)} color={color} style={{marginTop: scale(-5), marginBottom: scale(-2.5)}}/>,
                'profile': <Ionicons name='ios-person' size={scale(25)} color={color}/>
              }[tab]
            }
              <P
                style={
                  this.props.activeTab === i
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
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(5),
  },
  tabText: {
    marginTop: verticalScale(1),
    color: '#8E8E93',
    fontWeight: '400',
    fontSize: scale(13),
    fontFamily: 'System'
  },
  tabActiveText: {
    color: colors.primaryColor
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.backgroundColor.light
  }
});

export default CustomTabBar;
