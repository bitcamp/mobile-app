import React, { useState, useEffect } from "react";
import moment from "moment";
import { StyleSheet } from "react-native";
import { H3 } from "./Text";
import {
  HACKING_END_TIME,
  HACKATHON_NAME,
  HACKATHON_YEAR,
  HACKING_START_TIME,
} from "../hackathon.config";
import { hackingHasStarted, hackingHasEnded } from "../utils/time";

export default function CountdownTimer() {
  const [currTime, setCurrTime] = useState(moment());

  // Don't need consistent return here because `useEffect` arrow functions
  // should only return a cleanup method.
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!hackingHasEnded()) {
      const timer = setInterval(() => {
        setCurrTime(moment());
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, []);

  let timeDiff;
  let eventDescription;

  if (!hackingHasStarted(currTime)) {
    // Before the hackathon
    timeDiff = moment(HACKING_START_TIME).diff(currTime);
    eventDescription = `until ${HACKATHON_NAME} ${HACKATHON_YEAR}`;
  } else if (!hackingHasEnded(currTime)) {
    // During the hackathon
    timeDiff = moment(HACKING_END_TIME).diff(currTime);
    eventDescription = "left to hack";
  }

  if (timeDiff && eventDescription) {
    timeDiff = moment.duration(timeDiff);

    const daysText = timeDiff.days() !== 0 ? `${timeDiff.days()}d ` : "";
    const hoursText = `${timeDiff.hours()}h `;
    const minutesText = `${timeDiff.minutes()}m `;
    const secondsText = `${timeDiff.seconds()}s `;

    return (
      <H3 style={styles.countdownText}>
        {daysText + hoursText + minutesText + secondsText}
        <H3>{eventDescription}</H3>
      </H3>
    );
  }

  // After the hackathon
  return null;
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
