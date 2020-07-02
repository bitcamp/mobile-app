import React, { createContext, useMemo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { queryCache } from "react-query";
import useCachedGetRequest from "../../hooks/requests/useCachedGetRequest";
import { BASE_URL } from "../../api.config";
import mockFollowCounts from "../../mockData/mockFollowCounts";
import request from "../../utils/request";
import {
  computeFollowingCountObj,
  computeUserFollowedEventsSet,
} from "./followingUtils";

const FollowingContext = createContext();
const FollowingActionsContext = createContext();

/**
 * Provides information and utilities for following/unfollowing events.
 */
function FollowingProvider({ children }) {
  const [changingEvents, setChangingEvents] = useState(new Set());

  // Query keys for the useCachedGetRequest hooks
  const followCountKey = "/following-count";
  const userFollowedEventsKey = "/following";

  // `followCounts` is an object that maps event ids to follow counts
  const {
    data: followCounts,
    isFetching: followCountsFetching,
    error: followCountError,
    refetch: fetchFollowCounts,
  } = useCachedGetRequest(followCountKey, {
    variables: { responseData: mockFollowCounts },
    postProcess: computeFollowingCountObj,
  });

  // TODO: use the user's token in this response
  // `userFollowedEvents` is a Set() of event ids that the user follows
  const {
    data: userFollowedEvents,
    isFetching: userFollowedEventsFetching,
    error: userFollowedError,
    refetch: fetchUserFollowedEvents,
  } = useCachedGetRequest(userFollowedEventsKey, {
    variables: { responseData: [20051] },
    postProcess: computeUserFollowedEventsSet,
  });

  /**
   * Following API
   */

  // Toggles the following status for a particular event
  // Throws an error if a network request is currently underway
  const toggleFollowStatus = useCallback(
    async ({ eventId }) => {
      const isCurrentlyFollowing = userFollowedEvents.has(eventId);
      const action = isCurrentlyFollowing ? "unfollow" : "follow";

      if (!changingEvents.has(eventId)) {
        setChangingEvents(
          prevChangingEvents => new Set(prevChangingEvents.add(eventId))
        );

        // This will throw an error if it doesn't succeed
        const response = await request(
          `${BASE_URL}/${action}?eventId=${eventId}`,
          {
            responseData: { ok: true }, // TODO: fix this hack
            method: "POST",
          }
        );

        // Follow or unfollow the event in state when a follow/unfollow request succeeds
        queryCache.setQueryData(followCountKey, oldFollowCounts => ({
          ...oldFollowCounts,
          [eventId]: oldFollowCounts[eventId] + (isCurrentlyFollowing ? -1 : 1),
        }));

        queryCache.setQueryData(
          userFollowedEventsKey,
          oldUserFollowedEvents => {
            if (isCurrentlyFollowing) {
              oldUserFollowedEvents.delete(eventId);
            } else {
              oldUserFollowedEvents.add(eventId);
            }

            return new Set(oldUserFollowedEvents);
          }
        );

        setChangingEvents(prevChangingEvents => {
          // `Set.delete()` returns true or false, which causes an error
          // if we pass it into `new Set()` directly
          prevChangingEvents.delete(eventId);
          return new Set(prevChangingEvents);
        });

        return response; // Mostly needed so other functions can await this one
      }

      throw new Error(`Still processing your ${action} request...`);
    },
    [changingEvents, userFollowedEvents]
  );

  // Returns whether the user is currently following a given event
  const isUserFollowing = useCallback(
    eventId => userFollowedEvents.has(eventId),
    [userFollowedEvents]
  );

  // Returns the number of users following a given event
  const getFollowCount = useCallback(eventId => followCounts[eventId], [
    followCounts,
  ]);

  /**
   * Expensive value calculations
   */

  // All publicly available context actions
  const actions = useMemo(
    () => ({
      toggleFollowStatus,
      isUserFollowing,
      getFollowCount,
      fetchFollowCounts,
      fetchUserFollowedEvents,
    }),
    [
      fetchFollowCounts,
      fetchUserFollowedEvents,
      getFollowCount,
      isUserFollowing,
      toggleFollowStatus,
    ]
  );

  // Value provided by the context
  const state = useMemo(
    () => ({
      userFollowedEvents,
      followCounts,
      error: followCountError || userFollowedError,
      isFetching: followCountsFetching || userFollowedEventsFetching,
    }),
    [
      followCountError,
      followCounts,
      followCountsFetching,
      userFollowedError,
      userFollowedEvents,
      userFollowedEventsFetching,
    ]
  );

  return (
    <FollowingContext.Provider value={state}>
      <FollowingActionsContext.Provider value={actions}>
        {children}
      </FollowingActionsContext.Provider>
    </FollowingContext.Provider>
  );
}

FollowingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { FollowingContext, FollowingActionsContext, FollowingProvider };
