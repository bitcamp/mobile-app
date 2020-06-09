import React, { Component } from "react";
import {
  Alert,
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import PropTypes from "prop-types";
import QRCode from "react-native-qrcode-svg";
import { AntDesign } from "@expo/vector-icons";
import {
  PadContainer,
  SubHeading,
  ViewContainer,
  CenteredActivityIndicator,
} from "../components/Base";
import colors from "../components/Colors";
import { H3 } from "../components/Text";
import { scale } from "../utils/scale";
import EasterEggUsername from "../components/EasterEggUsername";

const FORCE_NORMAL_USER = false; // NOTE dangerous debug mode setting

const APP_ID = "@com.technica.technica18:";
const USER_TOKEN = `${APP_ID}JWT`;
const USER_DATA_STORE = "USER_DATA_STORE";

export default class Profile extends Component {
  static getFullName(user) {
    const {
      email,
      profile: { firstName, lastName },
    } = user;
    return firstName && lastName ? `${firstName} ${lastName}` : email;
  }

  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  async componentDidMount() {
    const {
      navigation: { navigate },
    } = this.props;

    const loggedInUser = JSON.parse(
      await AsyncStorage.getItem(USER_DATA_STORE)
    );

    if (!loggedInUser) {
      // TODO: investigate one user logging out and another one logging in
      // This is where we used to use react-native-restart, but that doesn't
      // work with expo
      const keys = [USER_DATA_STORE, USER_TOKEN];
      AsyncStorage.multiRemove(keys).then(() => {
        navigate("Login");
      });
    }

    if (FORCE_NORMAL_USER) {
      loggedInUser.admin = false;
    }
    this.setState({ user: loggedInUser });
  }

  async logout() {
    const {
      navigation: { navigate },
    } = this.props;

    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "OK",
          onPress: () => {
            AsyncStorage.removeItem(USER_DATA_STORE).then(() => {
              navigate("login");
            });
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  }

  render() {
    const { user } = this.state;

    if (user.profile) {
      // TODO: check which one is actually being encoded in the QR code
      const id = user.id || user.email;

      return (
        <ViewContainer>
          <View style={styles.verticallyCenteredContent}>
            <View style={styles.QRCode}>
              {user.profile && <QRCode value={id} size={scale(175)} />}
            </View>
            <H3 style={{ color: colors.textColor.light }}>
              Scan this code at check-in
            </H3>
          </View>
          <PadContainer>
            {user.profile && (
              <View style={styles.verticallyCenteredContent}>
                <EasterEggUsername
                  username={Profile.getFullName(user)}
                  style={styles.username}
                />
                <SubHeading style={styles.email}>{user.email}</SubHeading>
              </View>
            )}
          </PadContainer>
          <View style={styles.profileActions}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.logoutButton]}
                onPress={() => this.logout()}
              >
                <AntDesign name="logout" size={45} color="white" />
              </TouchableOpacity>
              <H3 style={styles.buttonTitle}>Sign Out</H3>
            </View>
          </View>
        </ViewContainer>
      );
    }

    // While the user is loading, render a loading animation
    return <CenteredActivityIndicator />;
  }
}

const styles = StyleSheet.create({
  QRCode: {
    backgroundColor: "white",
    borderColor: "transparent",
    borderRadius: 8,
    borderWidth: 0,
    marginTop: scale(15),
    padding: scale(7),
  },
  actionButton: {
    borderRadius: scale(15),
    marginBottom: scale(5),
    padding: scale(15),
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    fontWeight: "bold",
  },
  email: {
    marginTop: -10,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "red",
  },
  profileActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  username: {
    marginTop: scale(-15),
    textAlign: "center",
  },
  verticallyCenteredContent: {
    alignItems: "center",
  },
});

Profile.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired })
    .isRequired,
};
