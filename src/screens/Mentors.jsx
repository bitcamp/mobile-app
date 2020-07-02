import React, { Component } from "react";
import {
  AppState,
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import PropTypes from "prop-types";
import { Button, PadContainer, ViewContainer } from "../components/Base";
import QuestionCard from "../components/QuestionCard";
import { H2, P } from "../components/Text";
import { scale } from "../utils/scale";
import mockFetch from "../mockData/mockFetch";
import mockQuestions from "../mockData/mockQuestions";
import { questionType } from "../utils/PropTypeUtils";
import { HACKATHON_NAME } from "../hackathon.config";

// TODO: move to somewhere central
const serverURL = "https://guarded-brook-59345.herokuapp.com";

export default class Mentors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appState: AppState.currentState,
      listData: [],
    };
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  // initially loads question data from server
  async componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);
    const userData = await AsyncStorage.getItem("USER_DATA_STORE");
    const userDataJSON = JSON.parse(userData);
    this.grabQuestionsFromDB(userDataJSON.email);

    const { navigation } = this.props;

    // When you navigate the mentors page and there are questions in the route params,
    // update the questions state immdediately (before fetching)
    this.unsubscribeFromNavigator = navigation.addListener("focus", () => {
      const { route } = this.props;

      if (route.params && route.params.questions) {
        this.setState({ listData: route.params.questions });
      }
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
    this.unsubscribeFromNavigator();
  }

  async grabQuestionsFromDB(email) {
    mockFetch(`${serverURL}/getquestions/${email}`, {
      responseData: mockQuestions,
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

    // TODO: add error handling
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
          {`${HACKATHON_NAME} mentors are experts in helping you with your hack or answering any additional questions you might have.`}
        </P>
      </View>
    );
  }

  render() {
    // this.createNotificationListener();
    const { navigation } = this.props;
    const { listData } = this.state;

    return (
      <ViewContainer>
        <PadContainer>{Mentors.renderHeading()}</PadContainer>
        <TouchableOpacity>
          <Button
            style={styles.questionButton}
            text="Ask a Question"
            onPress={() =>
              navigation.navigate("question modal", {
                questions: listData,
              })
            }
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
  questionButton: {
    borderRadius: 8,
    marginBottom: 40,
    padding: 16,
  },
});

Mentors.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      questions: PropTypes.arrayOf(questionType),
    }),
  }).isRequired,
};
