import React, { Component } from "react";
import moment from "moment";
import { StyleSheet } from "react-native";
import { H3, BaseText } from "./Text";
import EventsManager from "../events/EventsManager";

export default class CountdownTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currTime: moment(),
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        currTime: moment(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { currTime } = this.state;

    if (!EventsManager.hackingHasStarted(currTime)) {
      return <H3 style={styles.countdownText}>Bitcamp is April 12-14</H3>;
    }

    if (!EventsManager.hackingHasEnded(currTime)) {
      const remain = moment.duration(
        moment(EventsManager.getHackingEndTime()).diff(moment(currTime))
      );
      const days = remain.days();
      const hours = remain.hours();
      const minutes = remain.minutes();
      const seconds = remain.seconds();

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

    return null;
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
