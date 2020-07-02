import React from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { PadContainer, ViewContainer } from "../components/Base";
import CountdownTimer from "../components/CountdownTimer";
import EventColumns from "../components/events/EventColumns";
import { H2 } from "../components/Text";
import HappeningNowSlideshow from "../components/HappeningNowSlideshow";
import { useEventActions } from "../contexts/EventsContext/EventsHooks";
import { useFollowingState } from "../contexts/FollowingContext/FollowingHooks";
import EventsErrorHandler from "../components/events/EventsErrorHandler";

export default function Home() {
  const { getFeaturedEvents, getPopularEvents } = useEventActions();

  const { followCounts } = useFollowingState();

  // TODO: create a common component for this
  const renderPopularEventsSection = () => {
    const heading = "Popular Events";
    const events = followCounts && getPopularEvents(followCounts);

    return (
      <View style={styles.subSection}>
        <PadContainer style={styles.subSectionHeading}>
          <H2>{heading}</H2>
        </PadContainer>
        <View>
          <EventColumns heading={heading} eventsArr={events} origin="Home" />
        </View>
      </View>
    );
  };

  // TODO: create a common component for this (same as above)
  const renderBestForBeginnersSection = () => {
    const heading = "Featured Events";
    const events = getFeaturedEvents();

    return (
      <View style={styles.subSection}>
        <PadContainer style={styles.subSectionHeading}>
          <H2>{heading}</H2>
        </PadContainer>
        <EventColumns heading={heading} eventsArr={events} origin="Home" />
      </View>
    );
  };

  const renderHappeningNow = () => (
    <View style={styles.subSection}>
      <HappeningNowSlideshow />
    </View>
  );

  return (
    <EventsErrorHandler>
      <ViewContainer>
        <CountdownTimer />
        {renderHappeningNow()}
        {renderPopularEventsSection()}
        {renderBestForBeginnersSection()}
      </ViewContainer>
    </EventsErrorHandler>
  );
}

const styles = StyleSheet.create({
  subSection: {
    paddingBottom: 20,
  },
  subSectionHeading: {
    paddingBottom: 10,
  },
});

Home.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      modal: PropTypes.string,
    }),
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
