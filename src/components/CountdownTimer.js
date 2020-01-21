import React, { Component } from "react";
import moment from "moment";
import { StyleSheet, Text } from "react-native";
import { H3, BaseText } from "./Text";
import { colors } from "./Colors";

// when hacking begins
const START_TIME = moment("2019-04-12 21:00");
// when hacking ends
const END_TIME = moment("2019-04-14 09:00");

export default class CountdownTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: moment(),
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        time: moment(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const startTime = START_TIME;
    const endTime = END_TIME;

    let remain;

    let days;
    let hours;
    let minutes;
    let seconds;

    // If hacking hasn't begun
    if (this.state.time < startTime) {
      return <H3 style={styles.countdownText}>Bitcamp is April 12-14</H3>;

      // If hacking is over
    }
    if (this.state.time > endTime) {
      return <></>;

      // If hacking is currently happening
    }
    remain = moment.duration(moment(endTime).diff(moment(this.state.time)));
    days = remain.days();
    hours = remain.hours();
    minutes = remain.minutes();
    seconds = remain.seconds();

    const daysText = days > 0 ? `${days}d ` : ``;
    const hoursText = `${hours}h `;
    const minutesText = `${minutes}m `;
    const secondsText = `${seconds}s `;

    return (
      <H3 style={styles.countdownText}>
        {daysText + hoursText + minutesText + secondsText}
        <BaseText>left to hack</BaseText>
      </H3>
    );
  }
}

const styles = StyleSheet.create({
  countdownText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 10,
    textAlign: "center",
  },
});
