import React, { Component } from "react";
import {
  Alert,
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import QRCode from "react-native-qrcode-svg";
import RNRestart from "react-native-restart";
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import QRCodeScanner from "../components/QRCodeScanner";
import {
  PadContainer,
  SubHeading,
  ViewContainer,
  CenteredActivityIndicator,
} from "../components/Base";
import colors from "../components/Colors";
import FullScreenModal from "../components/modals/FullScreenModal";
import { H1, H2, H3 } from "../components/Text";
import { scale } from "../utils/scale";
import EasterEggUsername from "../components/EasterEggUsername";
import mockFetch from "../mockData/mockFetch";
import ModalHeader from "../components/modals/ModalHeader";

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

  static async logout() {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "OK",
          onPress: () => {
            AsyncStorage.removeItem(USER_DATA_STORE).then(() => {
              RNRestart.Restart();
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

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      scanner: false,

      scannerIsOn: true,
      scannedUser: false,
      scannedUserData: {},
    };

    this.onScanSuccess = this.onScanSuccess.bind(this);
  }

  async componentDidMount() {
    const {
      user: { profile },
    } = this.state;

    const loggedInUser = JSON.parse(
      await AsyncStorage.getItem(USER_DATA_STORE)
    );

    if (FORCE_NORMAL_USER) {
      loggedInUser.admin = false;
    }
    this.setState({ user: loggedInUser });
    if (!profile) {
      const keys = [USER_DATA_STORE, USER_TOKEN];
      AsyncStorage.multiRemove(keys).then(() => {
        RNRestart.Restart();
      });
    }
  }

  async onScanSuccess(e) {
    try {
      this.setState({ scannerIsOn: false });
      const userId = e.data;
      const url = `https://api.bit.camp/api/users/${userId}/checkIn`;
      const token = await AsyncStorage.getItem(USER_TOKEN);
      const response = await mockFetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      const responseJSON = await response.json();
      if (response.status === 200) {
        const userProfile = responseJSON.profile;
        // Set state for SUCCESS modal
        this.setState({
          scannedUserData: {
            displayName: Profile.getFullName(responseJSON),
            minorStatus: !userProfile.adult,
            dietaryRestrictions: userProfile.dietaryRestrictions,
          },
          scannedUser: true,
        });
      } else {
        // Set state for NOT FOUND modal
        this.setState({
          scannedUserData: null,
          scannedUser: true,
        });
      }
    } catch (error) {
      Alert.alert(
        "No internet connection.",
        "Try again.",
        [
          {
            text: "OK",
            onPress: () => {
              this.setState({ scannerIsOn: true });
            },
          },
        ],
        { cancelable: false }
      );
    }

    // this.scanner.reactivate();
  }

  toggleScanner() {
    this.setState(({ scanner }) => ({ scanner: !scanner }));
  }

  render() {
    const {
      scanner,
      scannerIsOn,
      scannedUser,
      scannedUserData,
      user,
    } = this.state;

    const scannerView = (() => {
      return (
        <FullScreenModal
          isVisible={scanner}
          onBackButtonPress={() => this.toggleScanner()}
          contentStyle={{ padding: 0 }}
          shouldntScroll
          header={
            <ModalHeader
              origin="Profile"
              onBackButtonPress={() => this.toggleScanner()}
            />
          }
        >
          <QRCodeScanner
            onScan={this.onScanSuccess}
            scannerIsOn={scannerIsOn}
          />
          <ScanResponseModal
            isVisible={scannedUser}
            scannedUserData={scannedUserData}
            onBack={() => {
              this.setState({ scannedUser: false, scannerIsOn: true });
            }}
          />
        </FullScreenModal>
      );
    })();

    const defaultView = (() => {
      if (user.profile) {
        const id = user.id || user.email; // TODO: possibly provide a more reasonable default

        const isOrganizer = user.admin || user.organizer;

        return (
          <ViewContainer>
            {isOrganizer && scannerView}
            <View style={{ alignItems: "center" }}>
              <View style={styles.QRCode}>
                {user.profile && <QRCode value={id} size={scale(175)} />}
              </View>
              <H3 style={{ color: colors.textColor.light }}>
                {isOrganizer
                  ? "Use this code for testing"
                  : "Scan this code at check-in"}
              </H3>
            </View>
            <PadContainer>
              {user.profile && (
                <View style={{ alignItems: "center" }}>
                  <EasterEggUsername
                    username={this.getFullName(user)}
                    style={styles.username}
                  />
                  <SubHeading style={{ textAlign: "center", marginTop: -10 }}>
                    {user.email}
                  </SubHeading>
                </View>
              )}
            </PadContainer>
            <View
              style={{
                justifyContent: "space-evenly",
                flexDirection: "row",
                marginTop: -15,
              }}
            >
              {isOrganizer && (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: "#d2d1d7" },
                    ]}
                    onPress={() => this.toggleScanner()}
                  >
                    <MaterialCommunityIcons
                      name="qrcode-scan"
                      size={50}
                      color="black"
                    />
                  </TouchableOpacity>
                  <H3 style={{ fontWeight: "bold" }}>Scanner</H3>
                </View>
              )}
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "red" }]}
                  onPress={() => Profile.logout()}
                >
                  <AntDesign name="logout" size={45} color="white" />
                </TouchableOpacity>
                <H3 style={{ fontWeight: "bold" }}>Sign Out</H3>
              </View>
            </View>
          </ViewContainer>
        );
      }
      return <CenteredActivityIndicator />;
    })();

    return defaultView;
  }
}

// TODO make this code less redundant
const ScanResponseModal = ({ isVisible, onBack, scannedUserData }) => {
  const { displayName, minorStatus, dietaryRestrictions } = scannedUserData;
  return (
    <Modal
      isVisible={isVisible}
      backdropColor={colors.backgroundColor.normal}
      backdropOpacity={0.6}
      onBackdropPress={onBack}
      onBackButtonPress={onBack}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      animationInTiming={250}
      animationOutTiming={300}
      backdropTransitionInTiming={250}
      backdropTransitionOutTiming={300}
    >
      <View
        style={{
          backgroundColor: colors.backgroundColor.normal,
          padding: 20,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!scannedUserData ? (
          <>
            <Ionicons
              name="md-close"
              size={48}
              color={colors.iconColor}
              style={{ marginBottom: 10 }}
            />
            <H2 style={{ color: colors.textColor.normal, marginBottom: 20 }}>
              NOT FOUND
            </H2>
            <H3 style={{ color: colors.textColor.light }}>
              Send to check-in table.
            </H3>
          </>
        ) : (
          <>
            <Ionicons
              name="md-checkmark"
              size={48}
              color={colors.secondaryColor}
              style={{ marginBottom: 10 }}
            />
            <H2 style={{ color: colors.secondaryColor, marginBottom: 20 }}>
              SUCCESS
            </H2>
            <H1 style={{ marginBottom: 20, textAlign: "center" }}>
              {displayName}
            </H1>
            {minorStatus && (
              <H3 style={{ color: colors.primaryColor }}>+ Minor</H3>
            )}
            {dietaryRestrictions != null &&
              dietaryRestrictions.length > 0 &&
              dietaryRestrictions[0] !== "I Have No Food Restrictions" && (
                <H3 style={{ color: colors.primaryColor }}>
                  + Dietary Restrictions
                </H3>
              )}
          </>
        )}
      </View>
    </Modal>
  );
};

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
  username: {
    marginTop: scale(-15),
    textAlign: "center",
  },
});
