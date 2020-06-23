import React from "react";
import { CenteredActivityIndicator } from "../components/Base";
import Saved from "../components/events/Saved";
import TabbedEventDays from "../components/TabbedEventDays";
import { useEventsState } from "../contexts/EventsContext/EventsHooks";

export default function Schedule() {
  const { eventDays } = useEventsState();

  if (eventDays.length === 0) {
    return <CenteredActivityIndicator />;
  }

  return (
    <TabbedEventDays
      eventDays={eventDays}
      extraTabs={[<Saved tabLabel="saved" key="saved" />]}
      origin="Schedule"
    />
  );
}
