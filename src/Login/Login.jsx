import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
} from "react-native";
import PropTypes from "prop-types";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Toast from "react-native-tiny-toast";
import { Button, Heading, PadContainer } from "../common/components/Base";
import { BaseText } from "../common/components/Text";
import colors from "../Colors";
import { HACKATHON_NAME, HACKATHON_YEAR } from "../hackathon.config";
import request from "../common/utils/request";
import { useAuthActions } from "../contexts/AuthContext/AuthHooks";
import { validateEmail } from "../common/utils/dataValidation";
import { BASE_URL } from "../api.config";

/**
 * The app's login screen for hackers and event organizers.
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { signIn } = useAuthActions();

  // Registers a new user for push notifications
  const registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (status === "granted") {
      try {
        const token = await Notifications.getExpoPushTokenAsync();

        await request(`${BASE_URL}/announce/subscribe`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
      } catch (e) {
        Toast.show("Error registering for push notifications", Toast.SHORT);
      }
    }
  };

  // Submits the user login requests
  const submitLogin = async () => {
    setErrorMessage("");

    // Validate email and password
    if (email === "" || !validateEmail(email)) {
      setErrorMessage("Please enter a valid email");
      return;
    }

    if (password === "") {
      setErrorMessage("Please enter a password");
      return;
    }

    // Try signing the user in and registering them for push notifications
    try {
      await signIn(email, password);
      registerForPushNotificationsAsync();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <PadContainer style={styles.subSection}>
        <Heading style={styles.heading}>
          {`Welcome to \n${HACKATHON_NAME} ${HACKATHON_YEAR}`}
        </Heading>
        <View style={styles.buttonContainer}>
          <Ionicons
            name="md-mail"
            size={24}
            color={colors.primaryColor}
            style={styles.icon}
          />
          <TextInput
            placeholder="Email"
            value={email}
            underlineColorAndroid="rgba(0,0,0,0)"
            onChangeText={setEmail}
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
            value={password}
            autoCompleteType="password"
            secureTextEntry
            underlineColorAndroid="rgba(0,0,0,0)"
            onChangeText={setPassword}
            placeholderTextColor={colors.textColor.light}
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <BaseText style={styles.error}>{errorMessage}</BaseText>
        <Button text="Submit" style={styles.button} onPress={submitLogin} />
      </PadContainer>
    </KeyboardAvoidingView>
  );
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
  container: {
    flex: 1,
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
    flex: 1,
    justifyContent: "center",
    padding: 15,
  },
});

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
