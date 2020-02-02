import moment from "moment";
import React, { Component } from "react";
import {
  Alert,
  AppState,
  AsyncStorage,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid as Toast,
} from "react-native";
// import firebase from "firebase";
import AltModalHeader from "../components/modals/AltModalHeader";
import { Button, PadContainer, ViewContainer } from "../components/Base";
import colors from "../components/Colors";
import ExternalLink from "../components/ExternalLink";
import FullScreenModal from "../components/modals/FullScreenModal";
import QuestionCard from "../components/QuestionCard";
import SwitchInput from "../components/SwitchInput";
import { H2, H3, P } from "../components/Text";
import { scale, verticalScale } from "../utils/scale";
import mockFetch from "../mockData/mockFetch";

const serverURL = "https://guarded-brook-59345.herokuapp.com";

export default class Mentors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      question: "",
      location: "",
      needsInPersonAssistance: false,
      slackUsername: "",
      newQuestionScreen: false,
      listData: [],
      needsDesignMentor: false,
    };
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.sendQuestion = this.sendQuestion.bind(this);
    this.cancelQuestion = this.cancelQuestion.bind(this);
  }

  // initially loads question data from server
  async componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);
    const userData = await AsyncStorage.getItem("USER_DATA_STORE");
    const userDataJSON = JSON.parse(userData);
    this.grabQuestionsFromDB(userDataJSON.email);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  async grabQuestionsFromDB(email) {
    mockFetch(`${serverURL}/getquestions/${email}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(async responseJson => {
        this.setState({ listData: responseJson });
      });
  }

  // TODO: Investigate the purpose of this function
  async handleAppStateChange(nextAppState) {
    const { appState } = this.state;
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      const userData = await AsyncStorage.getItem("USER_DATA_STORE");
      const userDataJSON = JSON.parse(userData);
      this.grabQuestionsFromDB(userDataJSON.email);
    }
    this.setState({ appState: nextAppState });
  }

  clearInputs() {
    this.setState({
      question: "",
      needsDesignMentor: false,
      needsInPersonAssistance: false,
    });
  }

  cancelQuestion() {
    this.clearInputs();
    this.setState(({ newQuestionScreen }) => ({
      newQuestionScreen: !newQuestionScreen,
    }));
  }

  toggleModal() {
    const { newQuestionScreen } = this.state;
    this.setState({ newQuestionScreen: !newQuestionScreen });
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
        key: moment().format(),
        name,
        email: userDataJSON.email,
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
      this.clearInputs();
      showSuccessToast();
      this.toggleModal();
      // make new question show up immediately at top of list
      this.setState(({ listData }) => ({
        listData: [questionObject, ...listData],
      }));
    }
  }

  // TODO: reimplement when firebase is setup
  // async createNotificationListener() {
  // // updates when app is in foreground
  // this.notificationListener = firebase
  //   .notifications()
  //   .onNotification(notification => {
  //     this.grabQuestionsFromDB(notification.data.email);
  //   });
  // // updates when app is in the background
  // this.notificationOpenedListener = firebase
  //   .notifications()
  //   .onNotificationOpened(notificationOpen => {
  //     this.grabQuestionsFromDB(notificationOpen.notification.data.email);
  //   });
  // }

  async updateQuestionStatus(notification) {
    const { key } = notification.data;
    const mentorName = notification.data.mentor_name;

    const questions = await AsyncStorage.getItem("questions");
    const qList = JSON.parse(questions);

    // update status of question
    qList.forEach((element, index) => {
      if (element.key === key) {
        element.status = `${mentorName} has claimed your question!`;
        qList[index] = element;
      }
    });
    // store update in local storage
    await AsyncStorage.setItem("questions", JSON.stringify(qList));
    this.setState({ listData: qList });
  }

  static renderHeading() {
    return (
      <View>
        <H2 style={[styles.bigTitle, styles.headingSpacing]}>
          Get help from a mentor
        </H2>
        <P style={styles.helpDescription}>
          Bitcamp mentors are experts in helping you with your hack or answering
          any additional questions you might have.
        </P>
      </View>
    );
  }

  renderNewQuestionModal() {
    const {
      question,
      location,
      newQuestionScreen,
      slackUsername,
      needsInPersonAssistance,
      needsDesignMentor,
    } = this.state;

    return (
      <FullScreenModal
        isVisible={newQuestionScreen}
        backdropColor={colors.backgroundColor.dark}
        onBackButtonPress={() => this.toggleModal()}
        contentStyle={styles.stretchyContainer}
        header={
          <AltModalHeader
            title="Request Help"
            leftText="Cancel"
            leftAction={this.cancelQuestion}
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
            placeholder="Slack Username (bitcamper)"
            placeholderTextColor={colors.textColor.light}
            autoCapitalize="none"
          />
          <View style={styles.inputDescriptionContainer}>
            {// In order for the link and the rest of the paragraph to display on one block,
            // we split the message into words and make each word its own text element
            "A Bitcamp mentor will respond to your message over Slack and may approach your table to assist if needed. Make sure that you"
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
              text="join Bitcamp's Slack workspace."
              url="https://bit.camp/slack"
            />
          </View>
        </View>
      </FullScreenModal>
    );
  }

  render() {
    // this.createNotificationListener();
    const { listData } = this.state;

    return (
      <ViewContainer>
        <PadContainer>
          {Mentors.renderHeading()}
          {this.renderNewQuestionModal()}
        </PadContainer>
        <TouchableOpacity>
          <Button
            style={styles.questionButton}
            text="Ask a Question"
            onPress={() => this.toggleModal()}
          />
        </TouchableOpacity>
        <PadContainer>
          {listData &&
            listData.length > 0 && (
              <H2 style={styles.bigTitle}>Your Questions</H2>
            ) &&
            listData.map(question => (
              <QuestionCard
                question={question.question}
                status={question.status}
                key={question.key}
              />
            ))}
        </PadContainer>
      </ViewContainer>
    );
  }
}

function showSuccessToast() {
  // Show toast after 600ms
  // This 600ms delay ensures the toast loads after the modal animation close
  // happens. There is a weird iOS issue where toast will vanish the moment
  // modal closes. This is the best workaround I could make for now.
  setTimeout(() => {
    Toast.show(
      "Question sent! Our next available mentor will come assist you.",
      Toast.LONG
    );
  }, 400);
}

const generalInputStyle = {
  alignItems: "center",
  backgroundColor: colors.backgroundColor.normal,
  flexDirection: "row",
  minHeight: 40,
  padding: 15,
};

const styles = StyleSheet.create({
  bigTitle: {
    fontSize: scale(22),
    marginBottom: scale(10),
  },
  headingSpacing: {
    marginBottom: 5,
    marginTop: 20,
  },
  helpDescription: {
    marginBottom: 20,
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
  questionButton: {
    borderRadius: 8,
    marginBottom: 40,
    padding: 16,
  },
  stretchyContainer: {
    backgroundColor: colors.backgroundColor.dark,
    flex: 1,
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
