import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { PadContainer, ViewContainer } from "../components/Base";
import CountdownTimer from "../components/CountdownTimer";
import EventColumns from "../components/events/EventColumns";
import { H2 } from "../components/Text";
import HappeningNowSlideshow from "../components/HappeningNowSlideshow";
import { EventsContext } from "../events/EventsContext";

export default function Home() {
  const [happeningNow, setHappeningNow] = useState([]);
  const { eventsManager } = useContext(EventsContext);

  // Continually grap the
  useEffect(() => {
    let didCancel = false;

    const timer = setInterval(() => {
      if (!didCancel) {
        setHappeningNow(eventsManager.getHappeningNow());
      }
    }, 1000 * 60);

    return () => {
      clearInterval(timer);
      didCancel = true;
    };
  });

  // TODO: create a common component for this
  const renderPopularEventsSection = () => {
    const heading = "Popular Events";
    const events = eventsManager.getTopEvents();
    return (
      <View style={styles.subSection}>
        <PadContainer style={styles.subSectionHeading}>
          <H2>{heading}</H2>
        </PadContainer>
        <View>
          <EventColumns
            heading={heading}
            eventsArr={events}
            eventManager={eventsManager}
            origin="Home"
          />
        </View>
      </View>
    );
  };

  // TODO: create a common component for this (same as above)
  const renderBestForBeginnersSection = () => {
    const heading = "Featured Events";
    const events = eventsManager.getFeaturedEvents();
    return (
      <View style={styles.subSection}>
        <PadContainer style={styles.subSectionHeading}>
          <H2>{heading}</H2>
        </PadContainer>
        <EventColumns
          heading={heading}
          eventsArr={events}
          eventManager={eventsManager}
          origin="Home"
        />
      </View>
    );
  };

  const renderHappeningNow = () => {
    const events =
      happeningNow.length === 0
        ? eventsManager.getHappeningNow()
        : happeningNow;

    return (
      <View style={styles.subSection}>
        <HappeningNowSlideshow
          dataSource={events}
          eventManager={eventsManager}
        />
      </View>
    );
  };

  return (
    <ViewContainer>
      <CountdownTimer />
      {renderHappeningNow()}
      {renderPopularEventsSection()}
      {renderBestForBeginnersSection()}
    </ViewContainer>
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
