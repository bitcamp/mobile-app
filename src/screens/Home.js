import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { PadContainer, ViewContainer } from '../components/Base';
import CountdownTimer from '../components/CountdownTimer';
import EventColumns from '../components/events/EventColumns';
import { H2 } from '../components/Text';
import HappeningNowSlideshow from '../components/HappeningNowSlideshow';

export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      updates: [],
      isUpdatesModalVisible: false,
      isMapModalVisible: false,
      happeningNow: this.props.eventManager.getHappeningNow(),
    };
    this.toggleMapModal = this.toggleMapModal.bind(this);
    this.toggleUpdatesModal = this.toggleUpdatesModal.bind(this);
    this.timer = setInterval(() => this.setState({happeningNow: this.props.eventManager.getHappeningNow()}), 1000*60);
  }

  toggleUpdatesModal() {
    this.setState({ isUpdatesModalVisible: !this.state.isUpdatesModalVisible });
  }

  renderPopularEventsSection = () => {
    const heading = "Popular Events";
    const events = this.props.eventManager.getTopEvents();
    return (
      <View style={styles.subSection}>
        <PadContainer style={styles.subSectionHeading}>
          <H2>{heading}</H2>
        </PadContainer>
        <View>
          <EventColumns
            heading={heading}
            eventsArr={events}
            eventManager={this.props.eventManager}
            origin={'Home'}
          />
        </View>
      </View>
    );
  };

  renderBestForBeginnersSection = () => {
    const heading = "Featured Events";
    const events = this.props.eventManager.getFeaturedEvents();
    return (
      <View style={styles.subSection}>
        <PadContainer style={styles.subSectionHeading}>
          <H2>{heading}</H2>
        </PadContainer>
        <EventColumns
          heading={heading}
          eventsArr={events}
          eventManager={this.props.eventManager}
          origin={'Home'}
        />
      </View>
    );
  };

  renderHappeningNow = () => {
    const events = (this.state.happeningNow.length === 0) 
      ? this.props.eventManager.getHappeningNow() 
      : this.state.happeningNow;

    return (
      <View style={styles.subSection}>
        <HappeningNowSlideshow
          dataSource={events}
          eventManager={this.props.eventManager}
        />
      </View>
    );
  };

  toggleMapModal = () => {
    this.setState({ isMapModalVisible: !this.state.isMapModalVisible });
  };

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
  bottomContainer: {
    backgroundColor: "white"
  },
  heading: {
    marginBottom: 20
  },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:'center'
  },
  subSection: {
    paddingBottom: 20
  },
  subSectionHeading: {
    paddingBottom: 10
  },
  columnContainer: {
    flex: 1,
    flexDirection: "row"
  },
  column: {
    flex: 5,
    flexDirection: "column"
  },
  event: {
    marginBottom: 15
  }
});
