import React, { Component } from "react";
import { AsyncStorage, StyleSheet, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import {
  Button,
  PadContainer,
  ViewContainer,
  CenteredActivityIndicator,
} from "../common/components/Base";
import QuestionCard from "./QuestionCard";
import { H2, P } from "../common/components/Text";
import { scale } from "../common/utils/scale";
import mockQuestions from "../common/mockData/mockQuestions";
import { questionType } from "../common/utils/PropTypeUtils";
import { HACKATHON_NAME } from "../hackathon.config";
import request from "../common/utils/request";
import ErrorView from "../common/components/ErrorView";
import { AuthContext } from "../contexts/AuthContext/AuthContext";

// TODO: move to somewhere central
const serverURL = "https://guarded-brook-59345.herokuapp.com";

export default class Mentors extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    // TODO: refactor to use `react-query`
    this.state = {
      listData: [],
      isLoading: true,
      error: null,
    };
  }

  // initially loads question data from server
  componentDidMount() {
    const { user } = this.context;
    const { navigation } = this.props;

    this.grabQuestionsFromDB(user.email);

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
    this.unsubscribeFromNavigator();
  }

  async grabQuestionsFromDB(email) {
    try {
      const listData = await request(`${serverURL}/getquestions/${email}`, {
        responseData: mockQuestions,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      this.setState({ listData, isLoading: false });
    } catch (error) {
      this.setState({ error, isLoading: false });
    }
  }

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

  renderQuestions() {
    const { listData, error } = this.state;

    if (error) {
      return (
        <ErrorView error={error} actionDescription="loading your questions" />
      );
    }

    return (
      listData.length > 0 && (
        <>
          <H2 style={styles.bigTitle}>Your Questions</H2>
          {listData.map(question => (
            <QuestionCard
              question={question.question}
              status={question.status}
              key={question.key}
            />
          ))}
        </>
      )
    );
  }

  render() {
    // this.createNotificationListener();
    const { navigation } = this.props;
    const { listData, isLoading } = this.state;

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
          {isLoading ? <CenteredActivityIndicator /> : this.renderQuestions()}
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
