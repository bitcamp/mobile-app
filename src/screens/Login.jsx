import React, { Component } from "react";
import { Alert, AsyncStorage, StyleSheet, TextInput } from "react-native";

import PropTypes from "prop-types";
import { Button, Heading, PadContainer, SubHeading } from "../components/Base";
import colors from "../components/Colors";
import KeyboardShift from "../components/KeyboardShift";
import mockFetch from "../mockData/mockFetch";
import isValidEmail from "../utils/isValidEmail";

const APP_ID = "@com.technica.technica18:";
const USER_TOKEN = `${APP_ID}JWT`;
const EVENT_FAVORITED_STORE = `${APP_ID}EVENT_FAVORITED_STORE`;
const USER_DATA_STORE = "USER_DATA_STORE";

export default class Login extends Component {
  static processUserEvents(events) {
    return events.reduce(
      (favoriteEventsMap, currEvent) => ({
        ...favoriteEventsMap,
        [currEvent]: true,
      }),
      {}
    );
  }

  constructor(props) {
    super(props);

    this.state = this.createInitialState();
    this.sendEmail = this.sendEmail.bind(this);
    this.sendReceivedCode = this.sendReceivedCode.bind(this);
  }

  createInitialState() {
    return {
      savedEmail: "",
      fieldValue: "",
      placeholder: "",
      greeting: "Welcome to \nBitcamp 2019",
      instruction: "Enter the email you used to sign up for Bitcamp.",
      nextPage: (
        <Button text="Next" style={styles.button} onPress={this.sendEmail} />
      ),
    };
  }

  static navigationOptions = {
    header: null,
  };

  async sendEmail() {
    const { fieldValue: email } = this.state;
    const validEmail = isValidEmail(email);
    if (validEmail != null) {
      const url = "https://api.bit.camp/auth/login/requestCode";
      try {
        const response = await mockFetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: validEmail }),
        });
        if (response.status === 200) {
          this.setState({
            greeting: "Great!",
            instruction:
              "We've sent a verification code to your email. Please enter that code below to login.",
            nextPage: (
              <Button
                onPress={this.sendReceivedCode}
                text="Submit"
                size={22}
                color="white"
                style={styles.button}
              />
            ),
            savedEmail: validEmail,
            fieldValue: "",
            placeholder: "xxxxxx",
          });
        } else {
          Alert.alert(
            "Your email was not found.",
            "If you recently registered for Bitcamp, please try again in 24 hrs.",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
        }
      } catch (error) {
        Alert.alert(
          "There was an error requesting a code.",
          "Try again.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }
    } else {
      Alert.alert(
        "Invalid Email.",
        "Please enter a valid email.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
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
        await AsyncStorage.setItem(
          USER_DATA_STORE,
          JSON.stringify(responseJson.user)
        );
        await AsyncStorage.setItem(USER_TOKEN, responseJson.token);

        const userFavoritedEvents = Login.processUserEvents(
          responseJson.user.favoritedFirebaseEvents
        );
        await AsyncStorage.setItem(
          EVENT_FAVORITED_STORE,
          JSON.stringify(userFavoritedEvents)
        );
        this.setState({ fieldValue: "" });
        navigation.navigate("AppContainer");

        // TODO: investigate if you can just await this before the navigate statement
        // this might happen after component is unmounted,
        // however without a delay it will change back as it animates
        // FYI this is kind of a hack since when the user navigates back we want to reset to the
        // phone, not SMS if it does not unmount for some reason
        setTimeout(() => {
          this.setState(this.createInitialState());
        }, 3000);
      } else {
        Alert.alert(
          "Failed to confirm pin.",
          "Please try again.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "There was an error confirming the pin.",
        "Try again.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  }

  render() {
    const {
      keyboardShown,
      instruction,
      placeholder,
      fieldValue,
      nextPage,
      greeting,
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

          {nextPage}
        </PadContainer>
      </KeyboardShift>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryColor,
    marginTop: 20,
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
