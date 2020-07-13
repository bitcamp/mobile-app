import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { AntDesign } from "@expo/vector-icons";
import {
  PadContainer,
  SubHeading,
  ViewContainer,
} from "../common/components/Base";
import colors from "../Colors";
import { H3 } from "../common/components/Text";
import { scale } from "../common/utils/scale";
import EasterEggUsername from "./EasterEggUsername";
import {
  useAuthState,
  useAuthActions,
} from "../contexts/AuthContext/AuthHooks";

export default function Profile() {
  const { user } = useAuthState();
  const { signOut } = useAuthActions();

  const onLogoutPress = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "OK",
          onPress: signOut,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ViewContainer>
      {// Only display the data when the user is defined
      user && (
        <>
          <View style={styles.verticallyCenteredContent}>
            <View style={styles.QRCode}>
              <QRCode value={user.email} size={scale(175)} />
            </View>
            <H3 style={{ color: colors.textColor.light }}>
              Scan this code at check-in
            </H3>
          </View>
          <PadContainer>
            <View style={styles.verticallyCenteredContent}>
              <EasterEggUsername
                username={`${user.firstName} ${user.lastName}`}
                style={styles.username}
              />
              <SubHeading style={styles.email}>{user.email}</SubHeading>
            </View>
          </PadContainer>
          <View style={styles.profileActions}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.logoutButton]}
                onPress={onLogoutPress}
              >
                <AntDesign name="logout" size={45} color="white" />
              </TouchableOpacity>
              <H3 style={styles.buttonTitle}>Sign Out</H3>
            </View>
          </View>
        </>
      )}
    </ViewContainer>
  );
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
