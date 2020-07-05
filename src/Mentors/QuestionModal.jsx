import moment from "moment";
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Alert,
  AsyncStorage,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Toast from "react-native-tiny-toast";
import PropTypes from "prop-types";
import FullScreenModal from "../common/components/modals/FullScreenModal";
import colors from "../Colors";
import AltModalHeader from "../common/components/modals/AltModalHeader";
import { H3, P } from "../common/components/Text";
import SwitchInput from "../common/components/SwitchInput";
import ExternalLink from "../common/components/ExternalLink";
import { scale, verticalScale } from "../common/utils/scale";
import mockFetch from "../common/mockData/mockFetch";
import { questionType } from "../common/utils/PropTypeUtils";
import { HACKATHON_NAME } from "../hackathon.config";

const serverURL = "https://guarded-brook-59345.herokuapp.com";

// TODO: move to somewhere central
export default class QuestionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "",
      location: "",
      needsInPersonAssistance: false,
      slackUsername: "",
      needsDesignMentor: false,
    };
    this.sendQuestion = this.sendQuestion.bind(this);
  }

  async sendQuestion() {
    const {
      question,
      needsInPersonAssistance,
      needsDesignMentor,
      location,
      slackUsername,
    } = this.state;

    const hasNoQuestion = question === "";
    const hasNoLocation = location === "" && needsInPersonAssistance;
    const hasNoUsername = slackUsername === "" && !needsInPersonAssistance;

    let errorMessage;
    if (hasNoQuestion) {
      errorMessage = "Your question was empty";
    } else if (hasNoLocation) {
      errorMessage = "Your location was empty";
    } else if (hasNoUsername) {
      errorMessage = "Your slack username was empty";
    }

    if (hasNoQuestion || hasNoLocation || hasNoUsername) {
      Alert.alert("Try Again", errorMessage, [{ text: "OK" }], {
        cancelable: false,
      });
    } else {
      const fcmToken = await AsyncStorage.getItem("FCMToken");
      const userData = await AsyncStorage.getItem("USER_DATA_STORE");
      const userDataJSON = JSON.parse(userData);
      const name = `${userDataJSON.profile.firstName} ${userDataJSON.profile.lastName}`;
      const questionObject = {
        question,
        location,
        slackUsername,
        needsInPersonAssistance,
        needsDesignMentor,
        status: "Awaiting available mentors",
        name,
        email: userDataJSON.email,

        // Serves as a temporary key so we can display the question immediately
        // without waiting for the question id from the backend
        key: moment().format(),
      };
      if (fcmToken != null) {
        questionObject.fcmToken = fcmToken;
      }

      const questionString = JSON.stringify(questionObject);
      mockFetch(`${serverURL}/question`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: questionString,
      });

      // TODO: add in error handling

      Toast.show(
        "Question sent! Our next available mentor will come assist you.",
        Toast.LONG
      );

      // Go back to the mentors screen and pass in the new question so it can
      // be immediately added to state
      const { navigation, route } = this.props;
      navigation.navigate("main", {
        screen: "app",
        params: {
          screen: "mentors",
          params: { questions: [questionObject, ...route.params.questions] },
        },
      });
    }
  }

  render() {
    const { navigation } = this.props;
    const {
      question,
      location,
      slackUsername,
      needsInPersonAssistance,
      needsDesignMentor,
    } = this.state;

    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <FullScreenModal
          style={styles.modal}
          contentStyle={styles.stretchyContainer}
          header={
            <AltModalHeader
              title="Request Help"
              leftText="Cancel"
              leftAction={navigation.goBack}
              rightText="Submit"
              rightAction={this.sendQuestion}
            />
          }
        >
          <View style={styles.inputGroup}>
            <H3 style={styles.inputGroupTitle}>QUESTION</H3>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={10}
              onChangeText={text => this.setState({ question: text })}
              value={question}
              underlineColorAndroid="transparent"
              placeholder="How do I make X using Y?"
              placeholderTextColor={colors.textColor.light}
              autoFocus
            />
          </View>
          <View style={styles.inputGroup}>
            <H3 style={styles.inputGroupTitle}>I WOULD LIKE</H3>
            <SwitchInput
              style={[styles.switchInput, styles.topInput]}
              onPress={() =>
                this.setState({
                  needsInPersonAssistance: !needsInPersonAssistance,
                })
              }
              text="In-person assistance"
              value={needsInPersonAssistance}
              isDisabled={needsDesignMentor}
            />
            <SwitchInput
              style={styles.switchInput}
              onPress={() =>
                this.setState({
                  needsDesignMentor: !needsDesignMentor,
                  needsInPersonAssistance:
                    !needsDesignMentor || needsInPersonAssistance,
                })
              }
              text="A Design Den mentor"
              value={needsDesignMentor}
            />
            <View style={styles.inputDescriptionContainer}>
              {"Design Den mentors can help your team create effective visual design for your project."
                .split(" ")
                .map((word, index) => (
                  // Since we are using a constant string whose words will not be rearranged,
                  // there is no reason why using indices for keys will lead to bad behavior
                  // eslint-disable-next-line react/no-array-index-key
                  <P key={index} style={styles.inputDescription}>
                    {`${word} `}
                  </P>
                ))}
              <ExternalLink
                text="Learn More..."
                url="https://medium.com/@bitcmp/design-den-907a6f40c3a9"
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <H3 style={styles.inputGroupTitle}>ABOUT YOU</H3>
            <TextInput
              style={[styles.input, styles.topInput]}
              onChangeText={text => this.setState({ location: text })}
              value={location}
              underlineColorAndroid="transparent"
              placeholder="Table Number (B5)"
              placeholderTextColor={colors.textColor.light}
            />
            <TextInput
              style={styles.input}
              onChangeText={text => this.setState({ slackUsername: text })}
              value={slackUsername}
              underlineColorAndroid="transparent"
              placeholder="Slack Username (hacker1337)"
              placeholderTextColor={colors.textColor.light}
              autoCapitalize="none"
            />
            <View style={styles.inputDescriptionContainer}>
              {// In order for the link and the rest of the paragraph to display on one block,
              // we split the message into words and make each word its own text element
              `A ${HACKATHON_NAME} mentor will respond to your message over Slack and may approach your table to assist if needed. Make sure that you`
                .split(" ")
                .map((word, index) => (
                  // Since we are using a constant string whose words will not be rearranged,
                  // there is no reason why using indices for keys will lead to bad behavior
                  // eslint-disable-next-line react/no-array-index-key
                  <P key={index} style={styles.inputDescription}>
                    {`${word} `}
                  </P>
                ))}
              <ExternalLink
                text={`join ${HACKATHON_NAME}'s Slack workspace.`}
                url="https://bit.camp/slack"
              />
            </View>
          </View>
        </FullScreenModal>
      </KeyboardAvoidingView>
    );
  }
}

const generalInputStyle = {
  alignItems: "center",
  backgroundColor: colors.backgroundColor.normal,
  flexDirection: "row",
  minHeight: 40,
  padding: 15,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    ...generalInputStyle,
    color: colors.textColor.normal,
    fontSize: scale(14),
  },
  inputDescription: {
    color: "#6d6d72",
    fontSize: scale(12),
  },
  inputDescriptionContainer: {
    padding: 15,
    paddingTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  inputGroup: {
    marginBottom: 5,
    marginTop: verticalScale(20),
  },
  inputGroupTitle: {
    color: "#6d6d72",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 5,
    paddingLeft: 15,
  },
  modal: {
    backgroundColor: colors.backgroundColor.dark,
  },
  stretchyContainer: {
    paddingHorizontal: 0,
  },
  switchInput: generalInputStyle,
  textArea: {
    minHeight: verticalScale(200),
    textAlignVertical: "top",
  },
  topInput: {
    borderBottomColor: colors.borderColor.light,
    borderBottomWidth: 1,
  },
});

QuestionModal.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      questions: PropTypes.arrayOf(questionType).isRequired,
    }).isRequired,
  }).isRequired,
};
