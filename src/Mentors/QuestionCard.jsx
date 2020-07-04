import React from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import AnimatedEllipsis from "react-native-animated-ellipsis";
import { Ionicons } from "@expo/vector-icons";
import { scale } from "../common/utils/scale";
import { H3, H6 } from "../common/components/Text";

export default function QuestionCard({ question, status }) {
  const iconSize = scale(13);
  const isClaimed = status.includes("claimed");

  return (
    <View style={styles.questionContainer}>
      <H3 style={styles.questionText}>{question}</H3>
      <View style={styles.statusContainer}>
        <Ionicons
          name={isClaimed ? "md-checkmark-circle" : "md-sync"}
          color={isClaimed ? questionColors.claimed : questionColors.unclaimed}
          size={iconSize}
          style={styles.icon}
          solid={isClaimed}
        />
        <H6 style={[styles.statusText, isClaimed && styles.claimedText]}>
          {status}
        </H6>
        {!isClaimed && <AnimatedEllipsis style={styles.animatedEllipsis} />}
      </View>
    </View>
  );
}

QuestionCard.propTypes = {
  question: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

const questionColors = {
  claimed: "#4CD964",
  unclaimed: "#FF9500",
};

const styles = StyleSheet.create({
  animatedEllipsis: {
    color: questionColors.unclaimed,
    fontSize: 15,
    fontWeight: "bold",
  },
  claimedText: {
    color: questionColors.claimed,
  },
  icon: {
    marginRight: scale(5),
  },
  questionContainer: {
    backgroundColor: "#EFEFF4",
    borderRadius: 10,
    marginVertical: scale(5),
    padding: scale(10),
  },
  questionText: {
    fontWeight: "bold",
  },
  statusContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: scale(5),
  },
  statusText: {
    color: questionColors.unclaimed,
  },
});
