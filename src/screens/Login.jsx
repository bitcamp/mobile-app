import React, { Component } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AsyncStorage, StyleSheet, TextInput, View } from "react-native";
import PropTypes from "prop-types";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Toast from "react-native-tiny-toast";
import { Button, Heading, PadContainer } from "../components/Base";
import { BaseText } from "../components/Text";
import colors from "../components/Colors";
// import KeyboardShift from "../components/KeyboardShift";
import mockFetch from "../mockData/mockFetch";
import validateUser from "../models/user";
import mockUser from "../mockData/mockUser";

const APP_ID = "@com.technica.technica18:";
const USER_TOKEN = `${APP_ID}JWT`;
const EVENT_FAVORITED_STORE = `${APP_ID}EVENT_FAVORITED_STORE`;
const USER_DATA_STORE = "USER_DATA_STORE";
const EXPO_ENDPOINT = "https://api.bit.camp/api/firebaseEvents/favoriteCounts/";

// TODO: There is an issue with expo when there is an alert is dismissed when a keyboard is currently in focus
// Right now the workaround is to just display a plain-text error below the text field,
// however we'd probably want to have a more elegant solution.

export default class Login extends Component {
  static createInitialState() {
    return {
      emailField: "",
      passwordField: "",
      placeholder: "",
      greeting: "Welcome to \nBitcamp 20XX",
      isError: false,
      errorMsg: "",
    };
  }

  static processUserEvents(events) {
    return events.reduce(
      (favoriteEventsMap, currEvent) => ({
        ...favoriteEventsMap,
        [currEvent]: true,
      }),
      {}
    );
  }

  static async registerForPushNotificationsAsync() {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (status === "granted") {
      const token = await Notifications.getExpoPushTokenAsync();

      try {
        mockFetch(EXPO_ENDPOINT, null, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: {
              value: token,
            },
          }),
        });
      } catch (e) {
        Toast.show("Error registering for push notifications", Toast.SHORT);
      }
    }
  }

  // TODO: This regex is not entirely accurate for emails.
  // Need to find a better way to validating emails.

  static isValidEmail(email) {
    const emailRegex = /^.+@.+..+$/;
    return emailRegex.test(email);
  }

  constructor(props) {
    super(props);

    this.state = Login.createInitialState();
  }

  async submitLogin() {
    const { emailField: email, passwordField: password } = this.state;

    this.setState({
      isError: false,
      errorMsg: "",
    });

    if (email === "" || !Login.isValidEmail(email) || password === "") {
      this.setState({
        isError: true,
        errorMsg: "Please enter a valid email/password.",
      });
      return;
    }

    const url = "https://api.bit.camp/auth/login";
    const { navigation } = this.props;

    try {
      const response = await mockFetch(url, mockUser, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const responseJson = await response.json();
      if (response.status === 200) {
        if (!validateUser(responseJson.user)) {
          // TODO: Handle this type of error properly.
          throw new "Received invalid user from response."();
        }
        /* call mockFetch with parameters */
        Login.registerForPushNotificationsAsync();

        const userFavoritedEvents = Login.processUserEvents(
          responseJson.user.favoritedFirebaseEvents
        );
        // Store data in AsyncStorage, then reset state
        await AsyncStorage.multiSet([
          [USER_DATA_STORE, JSON.stringify(responseJson.user)],
          [USER_TOKEN, responseJson.token],
          [EVENT_FAVORITED_STORE, JSON.stringify(userFavoritedEvents)],
        ]);

        this.setState(Login.createInitialState());
        navigation.navigate("app");
      } else {
        this.setState({
          isError: true,
          errorMsg: "Failed to authenticate user. Please try again.",
        });
      }
    } catch (error) {
      this.setState({
        isError: true,
        errorMsg: "Failed to authenticate user. Please try again.",
      });
    }
  }

  render() {
    const {
      emailField,
      passwordField,
      greeting,
      isError,
      errorMsg,
    } = this.state;

    return (
      <PadContainer style={styles.subSection}>
        <Heading style={styles.heading}>{greeting}</Heading>
        {/* <SubHeading>Login</SubHeading> */}
        <View style={styles.buttonContainer}>
          <Ionicons
            name="md-mail"
            size={24}
            color={colors.primaryColor}
            style={styles.icon}
          />
          <TextInput
            placeholder="Email"
            value={emailField}
            underlineColorAndroid="rgba(0,0,0,0)"
            onChangeText={field => this.setState({ emailField: field })}
            placeholderTextColor={colors.textColor.light}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Ionicons
            name="md-lock"
            size={24}
            color={colors.primaryColor}
            style={styles.icon}
          />
          <TextInput
            placeholder="Password"
            value={passwordField}
            autoCompleteType="password"
            secureTextEntry
            underlineColorAndroid="rgba(0,0,0,0)"
            onChangeText={field => this.setState({ passwordField: field })}
            placeholderTextColor={colors.textColor.light}
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <BaseText style={styles.error}>{isError ? errorMsg : " "}</BaseText>
        <Button
          text="Submit"
          style={styles.button}
          onPress={() => this.submitLogin()}
        />
      </PadContainer>
      // <KeyboardShift>
      //   <PadContainer
      //     style={keyboardShown ? styles.subSection2 : styles.subSection}
      //   >
      //     <Heading style={styles.heading}>{greeting}</Heading>
      //     {/* <SubHeading>Login</SubHeading> */}
      //     <TextInput
      //       placeholder="Email"
      //       value={emailField}
      //       underlineColorAndroid="rgba(0,0,0,0)"
      //       onChangeText={field => this.setState({ emailField: field })}
      //       placeholderTextColor={colors.textColor.light}
      //       keyboardType="email-address"
      //       autoCapitalize="none"
      //       style={styles.input}
      //     />
      //     <TextInput
      //       placeholder="Password"
      //       value={passwordField}
      //       autoCompleteType="password"
      //       secureTextEntry
      //       underlineColorAndroid="rgba(0,0,0,0)"
      //       onChangeText={field => this.setState({ passwordField: field })}
      //       placeholderTextColor={colors.textColor.light}
      //       autoCapitalize="none"
      //       style={styles.input}
      //     />
      //     <BaseText style={styles.error}>{isError ? errorMsg : " "}</BaseText>
      //     <Button
      //       text="Submit"
      //       style={styles.button}
      //       onPress={() => this.submitLogin()}
      //     />
      //   </PadContainer>
      // </KeyboardShift>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryColor,
    marginTop: 8,
    padding: 12,
  },
  buttonContainer: {
    alignContent: "center",
    display: "flex",
    flexDirection: "row",
    paddingBottom: 5,
    paddingTop: 5,
    width: "80%",
  },
  error: {
    color: colors.textColor.error,
    marginTop: 10,
    textAlign: "center",
  },
  heading: {
    // paddingBottom: 0,
  },
  icon: {
    height: 32,
    marginRight: 8,
    marginTop: 8,
    width: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.borderColor.normal,
    color: colors.textColor.normal,
    fontSize: 24,
    width: "100%",
  },
  subSection: {
    alignSelf: "center",
    backgroundColor: colors.backgroundColor.normal,
    display: "flex",
    marginTop: "60%",
    width: "90%",
  },
});

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
