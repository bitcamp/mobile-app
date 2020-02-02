import React, { Component } from "react";
import {
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { LinearGradient } from "expo-linear-gradient";
import PropTypes from "prop-types";
import _ from "lodash";
import FullScreenModal from "./FullScreenModal";
import { H3 } from "../Text";
import colors from "../Colors";
import PillBadge from "../PillBadge";
import { scale } from "../../utils/scale";
import SearchBarTabView from "../SearchBarTabView";
import { getDeviceHeight } from "../../utils/sizing";
import EventsManager from "../../events/EventsManager";
import EventDay from "../../events/EventDay";
import { eventCategories } from "../../events/eventConfig";

export default class SearchModal extends Component {
  constructor(props) {
    super(props);
    this.filterEvents = this.filterEvents.bind(this);
    this.state = {
      search: "",
      newSchedule: [],
      height: {
        ModalHeader: 0,
        SearchBar: 0,
        TagViewParent: 0,
        TagScrollView: 0,
      },
      offsetHeight: 0,
      keyboardHeight: 0,
    };
  }

  componentDidMount() {
    this.keyboardDidShowSub = Keyboard.addListener(
      "keyboardDidShow",
      this.handleKeyboardDidShow
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      "keyboardDidHide",
      this.handleKeyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  // handleKeyboardDidShow(event) {
  //   // this.setState({keyboardHeight: event.endCoordinates.height});
  // }

  // handleKeyboardDidHide() {
  //   // this.setState({keyboardHeight: 0});
  // }

  measureView(event, view) {
    const { height: newHeight } = this.state;
    newHeight[view] = event.nativeEvent.layout.height;
    this.setState({
      height: newHeight,
      offsetHeight: Object.values(newHeight).reduce((acc, h) => acc + h, 0),
    });
  }

  filterEvents(query) {
    const { eventDays } = this.props;
    const queryRegex = escapeRegExp(query.toLowerCase());
    let newSchedule = [];

    if (query !== "") {
      newSchedule = _.cloneDeep(eventDays);

      // Filter out any event that doesn't match the query
      newSchedule = newSchedule.map(eventDay => ({
        ...eventDay,
        eventGroups: eventDay.eventGroups
          .map(eventGroup => ({
            ...eventGroup,
            events: eventGroup.events.filter(event => {
              // Checks if the event matches the category being searched
              const categorySearch = Array.isArray(event.category)
                ? event.category.some(
                    category => category.toLowerCase().search(queryRegex) >= 0
                  )
                : event.category.toLowerCase().search(queryRegex) >= 0;

              // Also, check if the event's title matches the query
              return (
                event.title.toLowerCase().search(queryRegex) >= 0 ||
                categorySearch
              );
            }),
          }))
          .filter(group => group.events.length > 0),
      }));
    }

    this.setState({
      newSchedule,
      search: query,
    });
  }

  renderBadges() {
    return Array.from(eventCategories).map(badgeTitle => (
      <TouchableOpacity
        onPress={() => this.filterEvents(badgeTitle)}
        key={badgeTitle}
      >
        <PillBadge category={badgeTitle} style={styles.badge} />
      </TouchableOpacity>
    ));
  }

  render() {
    const { isModalVisible, toggleModal, eventManager } = this.props;
    const {
      newSchedule: oldSchedule,
      search,
      offsetHeight,
      keyboardHeight,
    } = this.state;
    const newSchedule = oldSchedule.filter(day => day.eventGroups.length > 0);
    return (
      <FullScreenModal
        isVisible={isModalVisible}
        backdropColor="#f7f7f7"
        onBackButtonPress={toggleModal}
        contentStyle={styles.modalStyle}
        shouldntScroll
      >
        <View
          style={styles.headerContainer}
          onLayout={event => this.measureView(event, "SearchBar")}
        >
          <SearchBar
            placeholder="Search"
            platform="android"
            onChangeText={query => this.filterEvents(query)}
            onClear={() => this.filterEvents("")}
            value={search}
            autoFocus
            autoCapitalize="none"
            containerStyle={styles.flexible}
            inputContainerStyle={styles.inputContainerStyle}
            leftIconContainerStyle={styles.iconContainer}
            rightIconContainerStyle={styles.iconContainer}
            returnKeyType="search"
          />
          <View style={styles.textButtonContainer}>
            <TouchableOpacity onPress={toggleModal} style={styles.inflexible}>
              <H3 style={styles.exitText}>Cancel</H3>
            </TouchableOpacity>
          </View>
        </View>
        <View onLayout={event => this.measureView(event, "TagViewParent")}>
          <View style={styles.tagContainer}>
            <ScrollView
              horizontal
              onLayout={event => this.measureView(event, "TagScrollView")}
              showsHorizontalScrollIndicator={false}
            >
              {this.renderBadges()}
            </ScrollView>
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.7)",
                "rgba(255,255,255,0)",
                "rgba(255,255,255,0)",
                "rgba(255,255,255,0.7)",
              ]}
              locations={[0, 0.1, 0.8, 1]}
              start={[0, 0]}
              end={[1, 0]}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
          </View>
        </View>
        <SearchBarTabView
          screenHeight={getDeviceHeight()}
          offsetHeight={offsetHeight}
          keyboardHeight={keyboardHeight}
          schedule={newSchedule}
          eventManager={eventManager}
        />
      </FullScreenModal>
    );
  }
}

const styles = StyleSheet.create({
  badge: {
    marginLeft: 5,
  },
  exitText: {
    color: colors.primaryColor,
    padding: scale(15),
    paddingRight: 0,
    flex: 0,
    fontWeight: "500",
  },
  flexible: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: scale(15),
    paddingTop: Platform.OS === "ios" ? getStatusBarHeight() : 0,
  },
  iconContainer: {
    backgroundColor: colors.backgroundColor.dark,
  },
  inflexible: {
    flex: 0,
  },
  inputContainerStyle: {
    backgroundColor: colors.backgroundColor.dark,
    borderRadius: scale(10),
  },
  modalStyle: {
    padding: 0,
  },
  tagContainer: {
    flexGrow: 1,
    padding: 9,
    paddingTop: 10,
    paddingBottom: 10,
  },
  textButtonContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

SearchModal.propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
  eventDays: PropTypes.arrayOf(PropTypes.instanceOf(EventDay)).isRequired,
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
