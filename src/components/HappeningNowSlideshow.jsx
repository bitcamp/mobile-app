import PropTypes from "prop-types";
import React from "react";
import Swiper from "react-native-swiper";
import { StyleSheet } from "react-native";
import colors from "./Colors";
import Images from "../../assets/imgs/index";
import EventsManager from "../events/EventsManager";
import EventBanner from "./events/EventBanner";
import Banner from "./Banner";
import { getImageHeight } from "../utils/sizing";
import Event from "../events/Event";

/**
 * A slideshow that displays the events that are currently happening
 */
const HappeningNowSlideshow = ({ dataSource, eventManager }) => {
  // If there are now events happening now, display a default banner
  if (dataSource.length === 0) {
    return (
      <Banner
        imageSource={Images.banner_campfire}
        title={
          EventsManager.hackingHasEnded()
            ? "Thanks for Hacking!"
            : "No events at this time"
        }
        description={
          EventsManager.hackingHasEnded() ? "Bitcamp 2019" : "HAPPENING NOW"
        }
      />
    );
  }

  const slideshowContent = dataSource.map(event => (
    <EventBanner
      key={event.eventID}
      event={event}
      eventManager={eventManager}
    />
  ));

  return (
    // <EventBanner
    //   key="Cool Event Banner"
    //   event={dataSource[0]}
    //   eventManager={eventManager}
    // />
    <Swiper
      height={getImageHeight()}
      dotColor="rgba(255,255,255,.6)"
      activeDotColor={colors.textColor.primary}
      paginationStyle={styles.swiper}
      autoplay
      autoplayTimeout={5}
      loop
    >
      {slideshowContent}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  swiper: { bottom: 18 },
});

HappeningNowSlideshow.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
};

export default HappeningNowSlideshow;
