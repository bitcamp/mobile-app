import React, { Component } from "react";
import {
  Alert,
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import PropTypes from "prop-types";
import Modal from "react-native-modal";
import QRCode from "react-native-qrcode-svg";
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
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

class Profile extends Component {
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
      scanner: false,

      scannerIsOn: true,
      scannedUser: false,
      scannedUserData: {},
    };

    this.onScanSuccess = this.onScanSuccess.bind(this);
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
              navigate("Login");
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
          contentStyle={styles.noSpacingModal}
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
            <View style={styles.verticallyCenteredContent}>
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
              {isOrganizer && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.scanButton]}
                    onPress={() => this.toggleScanner()}
                  >
                    <MaterialCommunityIcons
                      name="qrcode-scan"
                      size={50}
                      color="black"
                    />
                  </TouchableOpacity>
                  <H3 style={styles.buttonTitle}>Scanner</H3>
                </View>
              )}
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
      return <CenteredActivityIndicator />;
    })();

    return defaultView;
  }
}

// TODO make this code less redundant & strip out of this file
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
      <View style={styles.scanModalContainer}>
        {!scannedUserData ? (
          <>
            <Ionicons
              name="md-close"
              size={48}
              color={colors.iconColor}
              style={styles.scanIcon}
            />
            <H2 style={[styles.scanStatusText, styles.scanFail]}>NOT FOUND</H2>
            <H3 style={styles.scanFailInstructions}>Send to check-in table.</H3>
          </>
        ) : (
          <>
            <Ionicons
              name="md-checkmark"
              size={48}
              color={colors.secondaryColor}
              style={styles.scanIcon}
            />
            <H2 style={styles.scanStatusText}>SUCCESS</H2>
            <H1 style={styles.scanUserName}>{displayName}</H1>
            {minorStatus && <H3 style={styles.minor}>+ Minor</H3>}
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
  minor: {
    color: colors.primaryColor,
  },
  noSpacingModal: {
    padding: 0,
  },
  profileActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  scanButton: {
    backgroundColor: "#d2d1d7",
  },
  scanFail: {
    color: colors.textColor.normal,
  },
  scanFailInstructions: {
    color: colors.textColor.light,
  },
  scanIcon: {
    marginBottom: 10,
  },
  scanModalContainer: {
    alignItems: "center",
    backgroundColor: colors.backgroundColor.normal,
    borderRadius: 8,
    justifyContent: "center",
    padding: 20,
  },
  scanStatusText: {
    color: colors.secondaryColor,
    marginBottom: 20,
  },
  scanUserName: {
    marginBottom: 20,
    textAlign: "center",
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

ScanResponseModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  scannedUserData: PropTypes.shape({
    displayName: PropTypes.string,
    minorStatus: PropTypes.bool,
    dietaryRestrictions: PropTypes.arrayOf(PropTypes.string),
  }),
};

ScanResponseModal.defaultProps = {
  scannedUserData: null,
};

export default withNavigation(Profile);
