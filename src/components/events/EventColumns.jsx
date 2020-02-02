import PropTypes from "prop-types";
import React, { Component } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { getDeviceWidth } from "../../utils/sizing";
import { Button } from "../Base";
import { H3 } from "../Text";
import EventCard from "./EventCard";
import Event from "../../events/Event";
import EventsManager from "../../events/EventsManager";

const CLIP_LIMIT = 6;

export default class EventColumns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false, // TODO: See if this state field is even necessary
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.getRows = this.getRows.bind(this);
    this.getCardCol = this.getCardCol.bind(this);
  }

  getCardCol(event, index) {
    const { origin, eventManager } = this.props;

    return (
      event && (
        <View
          style={[
            styles.halfColumn,
            index === 0 ? styles.firstCol : styles.otherCol,
          ]}
          key={index}
        >
          <EventCard
            event={event}
            eventManager={eventManager}
            origin={origin}
          />
        </View>
      )
    );
  }

  getRows(isClipped) {
    const { eventsArr } = this.props;

    const clipLength =
      eventsArr.length >= CLIP_LIMIT ? CLIP_LIMIT : eventsArr.length;

    const limit = isClipped ? clipLength : eventsArr.length;

    // If empty
    if (eventsArr.length === 0) {
      return <H3 style={styles.noEvents}>No events at this time.</H3>;
    }

    const rows = [];
    for (let i = 0; i < limit; i += 2) {
      const left = eventsArr[i];
      const right = eventsArr[i + 1];
      rows.push(
        <View
          key={i}
          style={[styles.row, isClipped === false ? styles.unclippedRow : null]}
        >
          {this.getCardCol(left, i)}
          {this.getCardCol(right, i + 1)}
        </View>
      );
    }

    const viewAllButton = isClipped && eventsArr.length > CLIP_LIMIT && (
      <TouchableOpacity key="viewButton" onPress={this.toggleModal}>
        <Button text="View All" />
      </TouchableOpacity>
    );

    return [rows, viewAllButton];
  }

  getRowOfEvents() {
    const { eventsArr } = this.props;

    const rowEventsList = eventsArr.map((event, index) =>
      this.getCardCol(event, index)
    );

    if (rowEventsList.length === 0) {
      return <H3 style={styles.noEvents}>No events at this time.</H3>;
    }
    return (
      <ScrollView
        horizontal
        style={styles.eventRowScroller}
        showsHorizontalScrollIndicator={false}
      >
        {rowEventsList}
      </ScrollView>
    );
  }

  toggleModal() {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  }

  render() {
    return (
      <View style={styles.eventRowContainer}>{this.getRowOfEvents()}</View>
    );
  }
}

const styles = StyleSheet.create({
  eventRowContainer: {
    flex: 1,
  },
  eventRowScroller: {
    paddingRight: 10,
  },
  firstCol: {
    marginLeft: 20,
  },
  halfColumn: {
    flex: 5,
    flexDirection: "column",
    marginRight: 20,
  },
  noEvents: {
    marginLeft: 20,
    opacity: 0.8,
    textAlign: "left",
  },
  otherCol: {
    marginLeft: 0,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    width: getDeviceWidth(),
  },
  unclippedRow: {
    marginLeft: -20,
  },
});

EventColumns.propTypes = {
  eventsArr: PropTypes.arrayOf(PropTypes.instanceOf(Event)),
  origin: PropTypes.string.isRequired,
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
};

EventColumns.defaultProps = {
  eventsArr: [],
};
