import React, { Component } from "react";
import { Alert, AsyncStorage, StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from 'react-native-modal';
import QRCode from "react-native-qrcode-svg";
import QRCodeScanner from "../components/QRCodeScanner";
import RNRestart from 'react-native-restart';
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { CenteredActivityIndicator, ModalHeader, PadContainer, SubHeading, ViewContainer, PlainViewContainer } from "../components/Base";
import { colors } from "../components/Colors";
import FullScreenModal from "../components/modals/FullScreenModal";
import { H1, H2, H3 } from "../components/Text";
import { scale } from '../utils/scale';
import EasterEggUsername from '../components/EasterEggUsername';
import { mockFetch } from "../mockData/mockFetch";

const FORCE_NORMAL_USER = false; // NOTE dangerous debug mode setting

const APP_ID = '@com.technica.technica18:';
const USER_TOKEN = APP_ID + 'JWT';
const USER_DATA_STORE = "USER_DATA_STORE";
const SCHEDULE_STORAGE_KEY = APP_ID + 'schedule';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      scanner: false,

      scannerIsOn: true,
      scannedUser: false,
      scannedUserData: {},

      // For fun...
      devoolooperMode: false,
      namePresses: 0,
      nameColor: colors.textColor.normal,
      timeInterval: null
    };
  }

  getFullName(user) {
    const {email, profile: {firstName, lastName}} = user;
    return (firstName && lastName) 
        ? `${firstName} ${lastName}`
        : email;
  }


  async logout() {
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
          }
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  }

  toggleScanner() {
    this.setState({ scanner: !this.state.scanner });
  }

  async onScanSuccess(e) {
    try {
      this.setState({ scannerIsOn: false });
      const userId = e.data;
      const url =`https://api.bit.camp/api/users/${userId}/checkIn`;
      const token = await AsyncStorage.getItem(USER_TOKEN);
      const response = await mockFetch(url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        }
      });

      const responseJSON = await response.json();
      if (response.status == 200) {
        const userProfile = responseJSON.profile;
        // Set state for SUCCESS modal
        this.setState({
          scannedUserData: {
            displayName: this.getFullName(responseJSON),
            minorStatus: !userProfile.adult,
            dietaryRestrictions: userProfile.dietaryRestrictions
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
      console.log(error);
      Alert.alert(
        "No internet connection.",
        "Try again.",
        [
          {
            text: "OK",
            onPress: () => {
              this.setState({ scannerIsOn: true })
            }
          }
        ],
        { cancelable: false }
      );
    }

    // this.scanner.reactivate();
  }

  async verifyHacker() {
    return true;
  }

  async componentDidMount() {
    var loggedInUser = JSON.parse(await AsyncStorage.getItem(USER_DATA_STORE));
    
    if (FORCE_NORMAL_USER) {
      loggedInUser.admin = false;
    }
    this.setState({ user: loggedInUser });
    if (!this.state.user.profile) {
      keys = [USER_DATA_STORE, USER_TOKEN];
      AsyncStorage.multiRemove(keys).then(() => {
        const navigate = this.props.navigation;
        RNRestart.Restart();
      });
    }
  }
  
  render() {

    const scannerView = (() => {
      return (
        <FullScreenModal
          isVisible={this.state.scanner}
          onBackButtonPress={() => this.toggleScanner()}
          contentStyle={{ padding: 0 }}
          shouldntScroll={true}
          header={
            <ModalHeader
              origin="Profile"
              onBackButtonPress={() => this.toggleScanner()}
            />
          }
        >
          <QRCodeScanner
            onScan={this.onScanSuccess.bind(this)}
            scannerIsOn={this.state.scannerIsOn}
          />
          <ScanResponseModal
            isVisible={this.state.scannedUser}
            scannedUserData={this.state.scannedUserData}
            onBack={() => {
              this.setState({ scannedUser: false, scannerIsOn: true });
            }}
          />
        </FullScreenModal>
      );
    })();

    const defaultView = (() => {
      if (this.state.user.profile) {
        const phone_number = this.state.user.profile.phoneNumber
          ? this.state.user.profile.phoneNumber
          : "";

        const id = this.state.user.id
          ? this.state.user.id
          : this.state.user.email; // TODO: possibly provide a more reasonable default

        const isOrganizer = this.state.user.admin || this.state.user.organizer;

        return (
          <ViewContainer>
            {isOrganizer &&
              scannerView}
            <View style={{ alignItems: "center" }}>
              <View style={styles.QRCode}>
                {this.state.user.profile && (
                  <QRCode
                    value={id}
                    size={scale(175)}
                  />
                )}
              </View>
              <H3 style={{ color: colors.textColor.light }}>
                {isOrganizer
                  ? "Use this code for testing"
                  : "Scan this code at check-in"
                }
              </H3>
            </View>
            <PadContainer>
              {this.state.user.profile &&
                <View style={{ alignItems: "center" }}>
                  <EasterEggUsername
                    username={this.getFullName(this.state.user)}
                    style={styles.username}
                  />
                  <SubHeading style={{ textAlign: "center", marginTop: -10 }}>
                    {this.state.user.email}
                  </SubHeading>
                </View>
              }
            </PadContainer>
            <View style={{ justifyContent: 'space-evenly', flexDirection: "row", marginTop: -15}}>
              {isOrganizer && (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity
                    style={[styles.actionButton, {backgroundColor: "#d2d1d7"}]}
                    onPress={() => this.toggleScanner()}
                  >
                    <MaterialCommunityIcons
                      name="qrcode-scan"
                      size={50}
                      color="black"
                    />
                  </TouchableOpacity>
                  <H3 style={{ fontWeight: 'bold' }}>Scanner</H3>
                </View>
              )}
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  style={[styles.actionButton, {backgroundColor: 'red'}]}
                  onPress={() => this.logout()}
                >
                  <AntDesign
                    name="logout"
                    size={45}
                    color="white"
                  />
                </TouchableOpacity>
                <H3 style={{fontWeight: "bold" }}>Sign Out</H3>
              </View>
            </View>
          </ViewContainer>
        );

      } else {
        return <CenteredActivityIndicator />;
      }
    })();

    return defaultView;
  }
}

// TODO make this code less redundant
const ScanResponseModal = props => {
  return (
    <Modal
      isVisible={props.isVisible}
      backdropColor={colors.backgroundColor.normal}
      backdropOpacity={0.6}
      onBackdropPress={props.onBack}
      onBackButtonPress={props.onBack}
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
        {
          !props.scannedUserData
          ? <React.Fragment>
              <Ionicons
                name="md-close"
                size={48}
                color={colors.iconColor}
                style={{ marginBottom: 10 }}
              />
              <H2 style={{ color: colors.textColor.normal, marginBottom: 20 }}>NOT FOUND</H2>
              <H3 style={{ color: colors.textColor.light }}>Send to check-in table.</H3>
            </React.Fragment>
          : <React.Fragment>
              <Ionicons
                name="md-checkmark"
                size={48}
                color={colors.secondaryColor}
                style={{ marginBottom: 10 }}
              />
              <H2 style={{ color: colors.secondaryColor, marginBottom: 20 }}>SUCCESS</H2>
              <H1 style={{ marginBottom: 20, textAlign: 'center' }}>{props.scannedUserData.displayName}</H1>
              {props.scannedUserData.minorStatus && (
                <H3 style={{ color: colors.primaryColor }}>+ Minor</H3>
              )}
              {props.scannedUserData.dietaryRestrictions != null &&
                props.scannedUserData.dietaryRestrictions.length > 0 &&
                props.scannedUserData.dietaryRestrictions[0] !==
                  "I Have No Food Restrictions" && (
                  <H3 style={{ color: colors.primaryColor }}>+ Dietary Restrictions</H3>
                )}
            </React.Fragment>
        }
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  actionButton: {
    marginBottom: scale(5),
    borderRadius: scale(15),
    padding: scale(15),
  },
  QRMarker: {
    width: '60%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.secondaryColor
  },
  QRCode: {
    marginTop: scale(15),
    backgroundColor: "white",
    borderRadius: 8,
    borderColor: 'transparent',
    borderWidth: 0,
    padding: scale(7)
  },
  username: {
    textAlign: "center",
    marginTop: scale(-15),
  }
});