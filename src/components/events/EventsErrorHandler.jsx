import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { useEventsState } from "../../contexts/EventsContext/EventsHooks";
import { useFollowingState } from "../../contexts/FollowingContext/FollowingHooks";
import { H2 } from "../Text";
import { CenteredActivityIndicator } from "../Base";

/**
 * Only displays its children if all of the data from the events/following contexts are loaded.
 * Includes helpful error displays and loading animations.
 * Meant to wrap entire screens whose child components are dependent on events/following data.
 */
export default function EventsErrorHandler({ children }) {
  // Extract data from the EventsContext and FollowingContext
  const {
    isFetching: eventsFetching,
    error: eventsError,
    eventsList,
  } = useEventsState();

  const {
    isFetching: followInfoFetching,
    error: followInfoError,
    followCounts,
    userFollowedEvents,
  } = useFollowingState();

  // Whether any data is still fetching
  const isFetching = eventsFetching || followInfoFetching;

  // Whether either context encountered an error
  const error = eventsError || followInfoError;

  // Whether the data for both contexts is loaded
  const isDataLoaded = Boolean(
    followCounts && eventsList && userFollowedEvents
  );

  // The main display of the screen
  const myScreen = useMemo(() => {
    // Loading events
    if (!isDataLoaded) {
      return !error && isFetching && <CenteredActivityIndicator />;
    }

    // Events endpoint was reached, but there were no events
    // TODO: possibly improve the appearance of this
    if (eventsList.length === 0) {
      return <H2>No events</H2>;
    }

    return children;
  }, [children, error, eventsList, isDataLoaded, isFetching]);

  return (
    <View style={styles.container}>
      {error && <H2 style={styles.errorText}>{error.message}</H2>}
      {myScreen}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    padding: 10,
  },
});

EventsErrorHandler.propTypes = {
  children: PropTypes.node.isRequired,
};
