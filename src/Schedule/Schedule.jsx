import React from "react";
import Saved from "./Saved";
import TabbedEventDays from "./TabbedEventDays";
import { useEventsState } from "../contexts/EventsContext/EventsHooks";
import EventsErrorHandler from "../common/components/events/EventsErrorHandler";

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
