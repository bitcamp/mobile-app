import React, { createContext } from "react";
import PropTypes from "prop-types";
import EventsManager from "./EventsManager";

const EventsContext = createContext();

// This is the globally avaliable EventManager that this context provides
const eventsManager = new EventsManager();

/**
 * Provides a single EventsManager instance for the entire app to interact with
 */
function EventsProvider({ children }) {
  return (
    <EventsContext.Provider value={{ eventsManager, hi: "bye" }}>
      {children}
    </EventsContext.Provider>
  );
}

EventsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { EventsContext, EventsProvider };
