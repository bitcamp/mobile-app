import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { PadContainer, ViewContainer } from "../components/Base";
import CountdownTimer from "../components/CountdownTimer";
import EventColumns from "../components/events/EventColumns";
import { H2 } from "../components/Text";
import HappeningNowSlideshow from "../components/HappeningNowSlideshow";
import EventsManager from "../events/EventsManager";

export default class Home extends Component {
  constructor(props) {
    super(props);
    const { eventManager } = this.props;

    this.state = {
      // updates: [],
      isUpdatesModalVisible: false,
      isMapModalVisible: false,
      happeningNow: eventManager.getHappeningNow(),
    };
    this.toggleMapModal = this.toggleMapModal.bind(this);
    this.toggleUpdatesModal = this.toggleUpdatesModal.bind(this);
    this.timer = setInterval(
      () =>
        this.setState({
          happeningNow: eventManager.getHappeningNow(),
        }),
      1000 * 60
    );
  }

  toggleUpdatesModal() {
    this.setState(({ isUpdatesModalVisible }) => ({
      isUpdatesModalVisible: !isUpdatesModalVisible,
    }));
  }

  toggleMapModal() {
    this.setState(({ isMapModalVisible }) => ({
      isMapModalVisible: !isMapModalVisible,
    }));
  }

  renderPopularEventsSection() {
    const { eventManager } = this.props;
    const heading = "Popular Events";
    const events = eventManager.getTopEvents();
    return (
      <View style={styles.subSection}>
        <PadContainer style={styles.subSectionHeading}>
          <H2>{heading}</H2>
        </PadContainer>
        <View>
          <EventColumns
            heading={heading}
            eventsArr={events}
            eventManager={eventManager}
            origin="Home"
          />
        </View>
      </View>
    );
  }

  renderBestForBeginnersSection() {
    const { eventManager } = this.props;
    const heading = "Featured Events";
    const events = eventManager.getFeaturedEvents();
    return (
      <View style={styles.subSection}>
        <PadContainer style={styles.subSectionHeading}>
          <H2>{heading}</H2>
        </PadContainer>
        <EventColumns
          heading={heading}
          eventsArr={events}
          eventManager={eventManager}
          origin="Home"
        />
      </View>
    );
  }

  renderHappeningNow() {
    const { happeningNow } = this.state;
    const { eventManager } = this.props;
    const events =
      happeningNow.length === 0 ? eventManager.getHappeningNow() : happeningNow;

    return (
      <View style={styles.subSection}>
        <HappeningNowSlideshow
          dataSource={events}
          eventManager={eventManager}
        />
      </View>
    );
  }

  render() {
    return (
      <ViewContainer>
        <CountdownTimer />
        {this.renderHappeningNow()}
        {this.renderPopularEventsSection()}
        {this.renderBestForBeginnersSection()}
      </ViewContainer>
    );
  }
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
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
};
