import React, { Component } from "react";
import {
  // AsyncStorage,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableHighlight,
  View,
  StyleSheet,
} from "react-native";
// import firebase from "firebase";
// import colors from "react-native-paper"; TODO: see if this is needed
import ScrollableTabView from "react-native-scrollable-tab-view";
import { SimpleLineIcons, FontAwesome } from "@expo/vector-icons";
import PropTypes from "prop-types";
import Images from "../../assets/imgs/index";
import colors from "../components/Colors";
import CustomTabBar from "../components/CustomTabBar";
import MapModal from "../components/modals/MapModal";
import SearchModal from "../components/modals/SearchModal";
import Home from "./Home";
import Mentors from "./Mentors";
import Profile from "./Profile";
import Schedule from "./Schedule";
import { scale } from "../utils/scale";
import { H1 } from "../components/Text";
import EventsManager from "../events/EventsManager";

// const channelId = "bitcamp-push-notifications";
// const channelName = "Bitcamp Announcements";

export default class AppContainer extends Component {
  static navigationOptions({ navigation }) {
    return {
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
        borderBottomWidth: 0.5,
        backgroundColor: colors.backgroundColor.light,
        borderColor: colors.borderColor.normal,
        height: scale(60),
      },
      headerLayoutPreset: "center",
      headerTintColor: colors.primaryColor,
      headerRight: AppContainer.getHeaderRight(navigation),
      headerLeft: AppContainer.getHeaderLeft(navigation),
    };
  }

  constructor(props) {
    super(props);
    const {
      navigation,
      screenProps: { eventManager },
    } = this.props;

    this.toggleMapModal = this.toggleMapModal.bind(this);
    this.toggleSearchModal = this.toggleSearchModal.bind(this);
    navigation.setParams({
      title: "bitcamp",
      showMapIcon: true,
      isMapModalVisible: false,
      isSearchModalVisible: false,
      toggleMapModal: this.toggleMapModal,
      toggleSearchModal: this.toggleSearchModal,
      eventManager,
      eventDays: eventManager.getEventDays(),
      showSearchIcon: false,
    });
  }

  static getHeaderRight(navigation) {
    if (
      !navigation.getParam("showMapIcon") &&
      !navigation.getParam("showSearchIcon")
    ) {
      return <View />;
    }

    const searchShouldDisplay = navigation.getParam("showSearchIcon");
    const iconProps = { size: 30, color: colors.primaryColor };

    return (
      <>
        <View style={styles.rightHeader}>
          <View style={styles.flex}>
            {searchShouldDisplay ? (
              <TouchableHighlight
                onPress={navigation.getParam("toggleSearchModal")}
                underlayColor="#f9f9f9"
              >
                <SimpleLineIcons name="magnifier" {...iconProps} />
              </TouchableHighlight>
            ) : (
              <TouchableHighlight
                onPress={navigation.getParam("toggleMapModal")}
                underlayColor={colors.white}
              >
                <FontAwesome name="map" {...iconProps} />
              </TouchableHighlight>
            )}
          </View>
        </View>
        {searchShouldDisplay ? (
          <SearchModal
            isModalVisible={
              navigation.state.params
                ? navigation.getParam("isSearchModalVisible")
                : false
            }
            toggleModal={() => navigation.state.params.toggleSearchModal()}
            eventDays={navigation.getParam("eventDays")}
            eventManager={navigation.getParam("eventManager")}
          />
        ) : (
          <MapModal
            isModalVisible={
              navigation.state.params
                ? navigation.getParam("isMapModalVisible")
                : false
            }
            toggleModal={() => navigation.state.params.toggleMapModal()}
          />
        )}
      </>
    );
  }

  static getHeaderLeft(navigation) {
    return (
      <View style={styles.leftHeader}>
        <View style={styles.flex}>
          <Image source={Images.bitcamp_logo} style={styles.logo} />
        </View>
        <View style={styles.titleContainer}>
          <H1>{navigation.getParam("title")}</H1>
        </View>
      </View>
    );
  }

  componentWillUnmount() {
    const {
      screenProps: { eventManager },
    } = this.props;
    eventManager.removeEventChangeListener(this.myHome);
    eventManager.removeEventChangeListener(this.mySchedule);
    eventManager.removeEventChangeListener(this.mySaved);

    eventManager.removeUpdatesListener(this.myHome);
  }

  toggleMapModal() {
    const { navigation } = this.props;
    navigation.setParams({
      isMapModalVisible: !navigation.getParam("isMapModalVisible"),
    });
  }

  toggleSearchModal() {
    const { navigation } = this.props;
    navigation.setParams({
      isSearchModalVisible: !navigation.getParam("isSearchModalVisible"),
    });
  }

  render() {
    // this.configureNotificationSettings();
    const {
      screenProps: { eventManager },
      navigation,
    } = this.props;
    return (
      <SafeAreaView style={styles.appBackground}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.backgroundColor.light}
        />
        <ScrollableTabView
          tabBarPosition="bottom"
          locked
          style={{
            backgroundColor:
              colors.backgroundColor.normal /* , paddingTop: 40 */,
          }}
          renderTabBar={({ goToPage, tabs, activeTab }) => (
            <CustomTabBar {...{ goToPage, tabs, activeTab }} />
          )}
          onChangeTab={tab => {
            const tabIndex = tab.i;
            const tabNames = ["bitcamp", "Schedule", "Mentors", "Profile"];

            navigation.setParams({
              title: tabNames[tabIndex],
              showMapIcon: tabIndex === 0,
              showSearchIcon: tabIndex === 1,
            });

            if (tabIndex === 1) {
              navigation.setParams({
                eventDays: eventManager.getEventDays(),
              });
            }
          }}
        >
          <Home
            ref={myHome => {
              this.myHome = myHome;
              eventManager.registerEventChangeListener(myHome);
              eventManager.registerUpdatesListener(myHome);
            }}
            eventManager={eventManager}
            tabLabel="home"
          />
          {/* TODO: use an HOC to get the navigation prop */}
          <Schedule
            ref={mySchedule => {
              this.mySchedule = mySchedule;
              eventManager.registerEventChangeListener(mySchedule);
            }}
            tabLabel="schedule"
            eventManager={eventManager}
            navigation={navigation}
          />
          <Mentors tabLabel="mentors" />
          {/* TODO: use an HOC to get the navigate function */}
          <Profile tabLabel="profile" navigation={navigation.navigate} />
        </ScrollableTabView>
      </SafeAreaView>
    );
  }

  // configureNotificationSettings() {
  // create notifications channel
  // TODO: rework push notifications since firebase fcm only works on android when using expo
  // console.warn(firebase.notifications);
  // const channel = new firebase.notifications.Android.Channel(
  //   channelId,
  //   channelName,
  //   firebase.notifications.Android.Importance.Max
  // ).setDescription(
  //   "Bitcamp notification channel for delivering important announcements"
  // );
  // firebase.notifications().android.createChannel(channel);
  // firebase
  //   .messaging()
  //   .hasPermission()
  //   .then(enabled => {
  //     if (enabled) {
  //       console.log("Permission enabled");
  //     } else {
  //       try {
  //         firebase.messaging().requestPermission();
  //       } catch (error) {
  //         console.log("Error authenticating", error);
  //       }
  //     }
  //   });
  // firebase
  //   .messaging()
  //   .getToken()
  //   .then(fcmToken => {
  //     if (fcmToken) {
  //       console.log("fcm token: ", fcmToken);
  //       // store FCMToken for use with mentorship notifications
  //       AsyncStorage.setItem("FCMToken", fcmToken);
  //     } else {
  //       console.log("no token");
  //     }
  //   });
  // firebase.messaging().subscribeToTopic("announcements");
  // this.notificationDisplayedListener = firebase
  //   .notifications()
  //   .onNotificationDisplayed(notification => {
  //     // Process your notification as required
  //     // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
  //     console.log("notification displayed", notification);
  //   });
  // this.notificationListener = firebase
  //   .notifications()
  //   .onNotification(notification => {
  //     console.log("notification received", notification);
  //     notification.android.setChannelId(channelId);
  //     firebase.notifications().displayNotification(notification);
  //   });
  // }
}

const styles = StyleSheet.create({
  appBackground: {
    backgroundColor: colors.backgroundColor.light,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  leftHeader: {
    flexDirection: "row",
    paddingLeft: 15,
  },
  logo: {
    height: 50,
    paddingVertical: scale(10),
    width: 50,
  },
  rightHeader: {
    flexDirection: "row",
    paddingRight: 15,
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 5,
  },
});

AppContainer.propTypes = {
  navigation: PropTypes.shape({
    setParams: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  screenProps: PropTypes.shape({
    eventManager: PropTypes.instanceOf(EventsManager).isRequired,
  }).isRequired,
};
