import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from "react-native";
import PropTypes from "prop-types";
import colors from "../Colors";
import EventModal from "../events/EventModal";
import EventStar from "../events/EventStar";
import PillBadge from "../PillBadge";
import { H3, H4 } from "../Text";
import Event from "../../events/Event";
import EventsManager from "../../events/EventsManager";

export default class EventDescription extends Component {
  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      isModalVisible: false,
    };
  }

  componentWillUnmount() {
    const { eventManager } = this.props;
    eventManager.removeHeartListener(this.myStar);
  }

  toggleModal() {
    this.setState(({ isModalVisible }) => ({
      isModalVisible: !isModalVisible,
    }));
  }

  renderModal() {
    const { isModalVisible } = this.state;
    const { origin, ...restOfProps } = this.props;
    return (
      <EventModal
        isModalVisible={isModalVisible}
        toggleModal={this.toggleModal}
        origin={origin}
        {...restOfProps}
      />
    );
  }

  render() {
    const { event, eventManager, style } = this.props;
    return (
      <>
        {this.renderModal()}
        <TouchableOpacity style={style} onPress={() => this.toggleModal()}>
          <View style={[styles.row, styles.eventcard]}>
            <View style={styles.column}>
              <H3 style={styles.title}>{event.title}</H3>
              <H4 style={styles.location}>{event.location}</H4>
              <View style={styles.badgeContainer}>
                {event.category.map((category, index) => (
                  <View
                    style={styles.badge}
                    key={event.title + index.toString()}
                  >
                    <PillBadge category={category} />
                  </View>
                ))}
              </View>
            </View>
            <View style={[styles.row, styles.favoriteButton]}>
              <EventStar
                ref={myStar => {
                  this.myStar = myStar;
                  eventManager.registerHeartListener(myStar);
                }}
                eventID={event.eventID.toString()}
                eventManager={eventManager}
                origin="Event Description"
              />
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  badge: {
    marginRight: 5,
  },
  badgeContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
    flex: 4,
    paddingHorizontal: 0,
  },
  eventcard: {
    padding: 12.5,
  },
  favoriteButton: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  location: {
    color: colors.textColor.light,
    fontSize: 17.5,
  },
  row: {
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
  },
});

EventDescription.propTypes = {
  origin: PropTypes.string.isRequired,
  event: PropTypes.instanceOf(Event).isRequired,
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
  style: ViewPropTypes.style,
};

EventDescription.defaultProps = {
  style: null,
};
