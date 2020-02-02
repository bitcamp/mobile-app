import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import LargeEventCard from "./LargeEventCard";
import EventsManager from "../../events/EventsManager";
import Event from "../../events/Event";

export default class EventsList extends Component {
  componentWillUnmount() {
    const { eventManager } = this.props;
    eventManager.removeUpdatesListener(this.myEventsList);
  }

  render() {
    const { events, eventManager, shouldDisplay } = this.props;
    return (
      shouldDisplay && (
        <View
          ref={myEventsList => {
            this.myEventsList = myEventsList;
            eventManager.registerUpdatesListener(myEventsList);
          }}
        >
          {events.map(event => (
            <LargeEventCard
              key={event.eventID}
              event={event}
              eventManager={eventManager}
              origin="Saved"
            />
          ))}
        </View>
      )
    );
  }
}

EventsList.propTypes = {
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
  events: PropTypes.arrayOf(PropTypes.instanceOf(Event).isRequired).isRequired,
  shouldDisplay: PropTypes.bool,
};

EventsList.defaultProps = {
  shouldDisplay: false,
};
