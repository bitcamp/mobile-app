import React, { useState, useEffect } from "react";
import Swiper from "react-native-swiper";
import { StyleSheet } from "react-native";
import colors from "../Colors";
import Images from "../../assets/imgs/index";
import EventBanner from "../common/components/events/EventBanner";
import Banner from "../common/components/Banner";
import { getImageHeight } from "../common/utils/sizing";
import { hackingHasEnded } from "../common/utils/time";
import { useEventActions } from "../contexts/EventsContext/EventsHooks";
import { HACKATHON_NAME, HACKATHON_YEAR } from "../hackathon.config";

/**
 * A slideshow that displays the events that are currently happening
 */
const HappeningNowSlideshow = () => {
  const { getOngoingEvents } = useEventActions();
  const [happeningNow, setHappeningNow] = useState([]);

  // Update the events that are happening now every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setHappeningNow(getOngoingEvents());
    }, 1000 * 60);

    return () => {
      clearInterval(timer);
    };
  }, [getOngoingEvents]);

  // If there are now events happening now, display a default banner
  if (happeningNow.length === 0) {
    return (
      <Banner
        imageSource={Images["banner-campfire"]}
        title={
          hackingHasEnded() ? "Thanks for Hacking!" : "No events at this time"
        }
        description={
          hackingHasEnded()
            ? `${HACKATHON_NAME} ${HACKATHON_YEAR}`
            : "HAPPENING NOW"
        }
      />
    );
  }

  return (
    <Swiper
      height={getImageHeight()}
      dotColor="rgba(255,255,255,.6)"
      activeDotColor={colors.textColor.primary}
      paginationStyle={styles.swiper}
      autoplay
      autoplayTimeout={5}
      loop
    >
      {happeningNow.map(event => (
        <EventBanner key={event.id} event={event} />
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  swiper: { bottom: 18 },
});

export default HappeningNowSlideshow;
