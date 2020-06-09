import React, { useContext } from "react";
import { CenteredActivityIndicator } from "../components/Base";
import Saved from "../components/events/Saved";
import { EventsContext } from "../events/EventsContext";
import TabbedEventDays from "../components/TabbedEventDays";

export default function Schedule() {
  const { eventsManager } = useContext(EventsContext);

  const eventDays = eventsManager.getEventDays();

  if (eventDays.length === 0) {
    return <CenteredActivityIndicator />;
  }
  return (
    <TabbedEventDays
      eventDays={eventDays}
      extraTabs={[<Saved tabLabel="saved" key="saved" />]}
    />
  );
}
