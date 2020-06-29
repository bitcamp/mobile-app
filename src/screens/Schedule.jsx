import React from "react";
import Saved from "../components/events/Saved";
import TabbedEventDays from "../components/TabbedEventDays";
import { useEventsState } from "../contexts/EventsContext/EventsHooks";
import EventsErrorHandler from "../components/events/EventsErrorHandler";

export default function Schedule() {
  const { eventDays } = useEventsState();

  return (
    <EventsErrorHandler>
      <TabbedEventDays
        eventDays={eventDays}
        extraTabs={[<Saved tabLabel="saved" key="saved" />]}
        origin="Schedule"
      />
    </EventsErrorHandler>
  );
}
