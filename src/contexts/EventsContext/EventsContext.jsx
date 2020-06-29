import React, { createContext, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import {
  processRawEvents,
  computeOngoingEvents,
  computePopularEvents,
  computeFeaturedEvents,
} from "./eventUtils";
import useCachedGetRequest from "../../hooks/requests/useCachedGetRequest";
import mockFlattenedSchedule from "../../mockData/mockFlattenedSchedule";

const EventsContext = createContext();
const EventActionsContext = createContext();

/**
 * Provides all information about the hackathon events
 */
function EventsProvider({ children }) {
  // Gets a list of all the events (either from AsyncStorage or the server) on mount
  // The events object has the shape `{
  //    list: Event[],
  //    byId: Object {[eventIds] : Event}
  //    days: EventDay[]
  // }`
  const {
    data: events,
    error,
    isFetching,
    refetch: fetchEvents,
  } = useCachedGetRequest(`/events`, {
    variables: [{ responseData: mockFlattenedSchedule }],
    postProcess: processRawEvents,
  });

  /**
   * Events API
   * All publicly available functions
   */

  // Returns the event object corresponding to the given id
  const getEvent = useCallback(eventId => events && events.byId[eventId], [
    events,
  ]);

  // Gets the events that are currently happening
  // TODO: possibly adjust how these are ordered
  const getOngoingEvents = useCallback(
    () => events && computeOngoingEvents(events.list),
    [events]
  );

  // Gets a list of events ordered by popularity
  const getPopularEvents = useCallback(
    followCounts => events && computePopularEvents(events.list, followCounts),
    [events]
  );

  // Gets a list of events ordered by point value
  const getFeaturedEvents = useCallback(
    () => events && computeFeaturedEvents(events.list),
    [events]
  );

  // Object containing the events api
  const actions = useMemo(
    () => ({
      fetchEvents,
      getEvent,
      getPopularEvents,
      getOngoingEvents,
      getFeaturedEvents,
    }),
    [
      fetchEvents,
      getEvent,
      getFeaturedEvents,
      getOngoingEvents,
      getPopularEvents,
    ]
  );

  // Value provided by the context
  const state = useMemo(
    () => ({
      eventsList: events && events.list,
      eventsById: events && events.byId,
      eventDays: events && events.days,
      isFetching,
      error,
    }),
    [error, events, isFetching]
  );

  return (
    <EventsContext.Provider value={state}>
      <EventActionsContext.Provider value={actions}>
        {children}
      </EventActionsContext.Provider>
    </EventsContext.Provider>
  );
}

EventsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// TODO: once the codebase is converted to hooks, don't export the EventsContext/EventActionsContext
export { EventsContext, EventActionsContext, EventsProvider };
