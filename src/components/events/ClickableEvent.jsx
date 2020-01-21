import React, { Component } from "react";
import { View, TouchableOpacity, ViewPropTypes } from "react-native";
import PropTypes from "prop-types";
import Event from "../../events/Event";
import EventsManager from "../../events/EventsManager";
import EventModal from "./EventModal";

/**
 * A card that will reveal a modal with extra info about an event when clicked
 */
export default class ClickableEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState(({ isModalVisible }) => ({
      isModalVisible: !isModalVisible,
    }));
  }

  render() {
    const { style, eventManager, event, origin, children } = this.props;
    const { isModalVisible } = this.state;

    return (
      <View style={style}>
        <EventModal
          isModalVisible={isModalVisible}
          toggleModal={this.toggleModal}
          eventManager={eventManager}
          event={event}
          origin={origin}
        />
        <TouchableOpacity onPress={this.toggleModal} activeOpacity={0.7}>
          {children}
        </TouchableOpacity>
      </View>
    );
  }
}

ClickableEvent.propTypes = {
  event: PropTypes.instanceOf(Event).isRequired,
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
  origin: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
  children: PropTypes.node,
};

ClickableEvent.defaultProps = {
  style: null,
  children: null,
};
