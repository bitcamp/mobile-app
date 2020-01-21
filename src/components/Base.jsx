import React, { Component, Fragment } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { Paper } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Images from "../../assets/imgs/index";
import { scale } from "../utils/scale";
import { colors } from "./Colors";
import EventStar from "./events/EventStar";
import { H1, H2, H3 } from "./Text";

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryColor,
    borderRadius: 4,
    marginLeft: 20,
    marginRight: 20,
    padding: 8,
  },
  buttonText: {
    color: colors.textColor.primary,
    textAlign: "center",
  },
  container: {
    backgroundColor: colors.backgroundColor.normal,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  heading: {
    flexDirection: "row",
    marginBottom: scale(15),
    paddingTop: scale(25),
  },
  horizontalLine: {
    backgroundColor: colors.borderColor.light,
    height: 1,
  },
  modalHeader: {
    paddingBottom: scale(4),
    paddingHorizontal: scale(15),
    paddingTop:
      Platform.OS === "ios" ? scale(4) + getStatusBarHeight() : scale(4),
  },
  modalHeaderNav: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  padContainer: {
    flex: 1,
    paddingLeft: scale(15),
    paddingRight: scale(15),
  },
  paper: {
    backgroundColor: colors.backgroundColor.white,
  },
  paperBody: {
    padding: 15,
  },
  spacing: {
    height: scale(10),
  },
  subHeading: {
    color: colors.textColor.light,
    marginBottom: scale(35),
  },
});

const PlainViewContainer = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

const ViewContainer = ({ style, children }) => (
  <PlainViewContainer>
    <ScrollView keyboardShouldPersistTaps="handled" style={styles.flex}>
      <View style={[styles.container, style]}>{children}</View>
    </ScrollView>
  </PlainViewContainer>
);

const PadContainer = ({ style, children }) => (
  <View style={[styles.padContainer, style]}>{children}</View>
);

const Heading = ({ logo, style, children }) =>
  logo ? (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        ...style,
      }}
    >
      <Image
        source={Images.bitcamp_logo}
        style={{ width: 45, height: 45, marginBottom: -10 }}
      />
      <Heading style={{ marginLeft: 12 }}>{children}</Heading>
    </View>
  ) : (
    <View style={styles.heading}>
      <H1 style={style}>{children}</H1>
    </View>
  );

const SubHeading = ({ style, children }) => (
  <View>
    <H2 style={[styles.subHeading, style]}>{children}</H2>
  </View>
);

const PaperSheet = ({ children }) => (
  <>
    {/* props.heading ? <H2 style={styles.paperHead}>{props.heading}</H2> : null */}
    <Paper style={styles.paper}>
      <View style={styles.paperBody}>{children}</View>
    </Paper>
  </>
);

const HorizontalLine = ({ style }) => (
  <View style={[styles.horizontalLine, style]} />
);

const Spacing = props => <View style={styles.spacing} />;

class ModalHeader extends Component {
  componentWillUnmount() {
    const { heart, eventManager } = this.props;
    if (heart) {
      eventManager.removeHeartListener(this.myStar);
    }
  }

  render() {
    const {
      onBackButtonPress,
      heart,
      noArrow,
      eventID,
      eventManager,
      origin,
    } = this.props;

    return (
      <View style={styles.modalHeader}>
        <View style={styles.modalHeaderNav}>
          <TouchableOpacity
            style={{ marginLeft: -10, padding: scale(4) }}
            onPress={onBackButtonPress}
          >
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-start",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="ios-arrow-back"
                size={35}
                color={colors.primaryColor}
                style={{ paddingRight: 7 }}
              />
              <H3 style={{ color: colors.primaryColor, fontSize: 20 }}>
                {origin}
              </H3>
            </View>
          </TouchableOpacity>
          {heart && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <EventStar
                ref={myStar => {
                  this.myStar = myStar;
                  eventManager.registerHeartListener(myStar);
                }}
                eventID={eventID}
                eventManager={eventManager}
                discludeArrow={noArrow}
                origin={origin}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const CenteredActivityIndicator = props => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      flexDirection: "row",
      padding: 10,
      backgroundColor: colors.backgroundColor.normal,
    }}
  >
    <ActivityIndicator size="large" color={colors.primaryColor} />
  </View>
);
const Button = ({ onPress, style, text }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.button, style]}>
      <H3 style={styles.buttonText}>{text}</H3>
    </View>
  </TouchableOpacity>
);

export {
  PlainViewContainer,
  ViewContainer,
  Heading,
  SubHeading,
  PaperSheet,
  PadContainer,
  HorizontalLine,
  Spacing,
  ModalHeader,
  CenteredActivityIndicator,
  Button,
};
