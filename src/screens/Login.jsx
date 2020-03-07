import React, { Component } from "react";
import { AsyncStorage, StyleSheet, TextInput } from "react-native";
import PropTypes from "prop-types";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Toast from "react-native-tiny-toast";
import { Button, Heading, PadContainer, SubHeading } from "../components/Base";
import { BaseText } from "../components/Text";
import colors from "../components/Colors";
import KeyboardShift from "../components/KeyboardShift";
import mockFetch from "../mockData/mockFetch";

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
      savedEmail: "",
      fieldValue: "",
      placeholder: "",
      greeting: "Welcome to \nBitcamp 2019",
      instruction: "Enter the email you used to sign up for Bitcamp.",
      isOnEmailPage: true,
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
        mockFetch(EXPO_ENDPOINT, {
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
    this.sendEmail = this.sendEmail.bind(this);
    this.sendReceivedCode = this.sendReceivedCode.bind(this);
  }

  static navigationOptions = {
    header: null,
  };

  async sendEmail() {
    const { fieldValue: email } = this.state;
    if (Login.isValidEmail(email)) {
      const url = "https://api.bit.camp/auth/login/requestCode";
      try {
        const response = await mockFetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        if (response.status === 200) {
          this.setState({
            greeting: "Great!",
            instruction:
              "We've sent a verification code to your email. Please enter that code below to login.",
            isOnEmailPage: false,
            savedEmail: email,
            fieldValue: "",
            placeholder: "xxxxxx",
          });
        } else {
          this.setState({
            isError: true,
            errorMsg:
              "Your email was not found. If you recently registered for Bitcamp, please try again in 24 hrs.",
          });
        }
      } catch (error) {
        this.setState({
          isError: true,
          errorMsg: "There was an error requesting a code. Try again.",
        });
      }
    } else {
      this.setState({
        isError: true,
        errorMsg: "Invalid Email. Please enter a valid email.",
      });
    }
  }

  async sendReceivedCode() {
    const { fieldValue: code, savedEmail } = this.state;
    const { navigation } = this.props;
    const url = "https://api.bit.camp/auth/login/code";
    try {
      const email = savedEmail;
      const response = await mockFetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });
      const responseJson = await response.json();
      if (response.status === 200) {
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
        navigation.navigate("AppContainer");
      } else {
        this.setState({
          isError: true,
          errorMsg: "Failed to confirm pin. Please try again.",
        });
      }
    } catch (error) {
      this.setState({
        isError: true,
        errorMsg: "There was an error confirming the pin. Try again.",
      });
    }
  }

  handleButtonPress() {
    const { isOnEmailPage } = this.state;
    // Reset error
    this.setState({
      isError: false,
      errorMsg: "",
    });
    if (isOnEmailPage) {
      this.sendEmail();
    } else {
      this.sendReceivedCode();
    }
  }

  render() {
    const {
      keyboardShown,
      instruction,
      placeholder,
      fieldValue,
      greeting,
      isOnEmailPage,
      isError,
      errorMsg,
    } = this.state;

    return (
      <KeyboardShift>
        <PadContainer
          style={keyboardShown ? styles.subSection2 : styles.subSection}
        >
          <Heading style={styles.heading}>{greeting}</Heading>
          <SubHeading>{instruction}</SubHeading>
          <TextInput
            placeholder={placeholder}
            value={fieldValue}
            underlineColorAndroid="rgba(0,0,0,0)"
            onChangeText={field => this.setState({ fieldValue: field })}
            placeholderTextColor={colors.textColor.light}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <BaseText style={styles.error}>{isError ? errorMsg : " "}</BaseText>
          <Button
            text={isOnEmailPage ? "Next" : "Submit"}
            style={styles.button}
            onPress={() => this.handleButtonPress()}
          />
        </PadContainer>
      </KeyboardShift>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryColor,
    marginTop: 10,
  },
  error: {
    color: colors.textColor.error,
    marginTop: 10,
  },
  heading: {
    paddingBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.borderColor.normal,
    color: colors.textColor.normal,
    fontSize: 24,
    paddingBottom: 8,
  },
  subSection: {
    backgroundColor: colors.backgroundColor.normal,
    paddingTop: "30%",
  },
  subSection2: {
    backgroundColor: colors.backgroundColor.normal,
  },
});

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
