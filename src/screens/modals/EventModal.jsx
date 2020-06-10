import moment from "moment";
import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import Images from "../../../assets/imgs/index";
import { scale } from "../../utils/scale";
import { getDeviceWidth, getImageHeight } from "../../utils/sizing";
import ModalHeader from "../../components/modals/ModalHeader";
import colors from "../../components/Colors";
import FullScreenModal from "../../components/modals/FullScreenModal";
import PillBadge from "../../components/PillBadge";
import { H2, H3, H4, P } from "../../components/Text";
import Event from "../../events/Event";
import { EventsContext } from "../../events/EventsContext";

/**
 * Displays all information about an event (e.g., title, categories,
 * full description). You can follow/unfollow events in this screen.
 */
const EventModal = ({ navigation, route }) => {
  const { eventsManager } = useContext(EventsContext);

  const { event, origin } = route.params;

  return (
    <FullScreenModal
      onModalHide={() => eventsManager.updateEventComponents()}
      style={styles.modal}
      header={
        <ModalHeader
          onBackButtonPress={navigation.goBack}
          eventID={event.eventID.toString()}
          eventManager={eventsManager}
          origin={origin}
          heart
          noArrow
        />
      }
    >
      <Image style={styles.banner} source={Images[event.img]} />
      <ScrollView>
        <View style={styles.viewWithSpacing}>
          <View>
            <H2>{event.title}</H2>
            <H3 style={styles.location}>{event.location}</H3>

            <View style={styles.badges}>
              {// Handle events with single and multiple categories
              [].concat(event.category).map((category, index) => (
                <View style={styles.badge} key={event.title + index.toString()}>
                  <PillBadge category={category} isBigger />
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.viewWithSpacing}>
          <View>
            <H3 style={styles.date}>
              {moment(event.startTime).format("dddd, MMMM D, YYYY")}
            </H3>
            <H3 style={styles.date}>{event.timeRangeString}</H3>
          </View>
        </View>

        {event.featured && (
          <View style={styles.viewWithSpacing}>
            <H4 style={{ color: colors.secondaryColor }}>FEATURED EVENT</H4>
          </View>
        )}
        <P style={styles.viewWithSpacing}>
          {event.description ? event.description : event.caption}
        </P>
      </ScrollView>
    </FullScreenModal>
  );
};

const styles = StyleSheet.create({
  badge: {
    marginRight: 5,
  },
  badges: {
    alignItems: "flex-start",
    flexDirection: "row",
    paddingBottom: 5,
    paddingTop: 5,
  },
  banner: {
    height: getImageHeight(),
    marginLeft: -scale(15),
    width: getDeviceWidth(), // Used to offset the padding on everything else in the modal
  },
  date: {
    color: colors.textColor.light,
  },
  location: {
    color: colors.primaryColor,
    marginVertical: 3,
  },
  modal: {
    backgroundColor: colors.backgroundColor.normal,
  },
  viewWithSpacing: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scale(15),
  },
});

EventModal.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      event: PropTypes.instanceOf(Event).isRequired,
      origin: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default EventModal;
