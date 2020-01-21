import moment from "moment";
import React from "react";
import PropTypes from "prop-types";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import Images from "../../../assets/imgs/index";
import { scale } from "../../utils/scale";
import { getDeviceWidth, getImageHeight } from "../../utils/sizing";
import { ModalHeader } from "../Base";
import { colors } from "../Colors";
import FullScreenModal from "../modals/FullScreenModal";
import PillBadge from "../PillBadge";
import { H2, H3, H4, P } from "../Text";
import EventsManager from "../../events/EventsManager";
import Event from "../../events/Event";

const EventModal = ({
  isModalVisible,
  toggleModal,
  eventManager,
  event,
  origin,
}) => (
  <FullScreenModal
    isVisible={isModalVisible}
    animationIn="fadeInRight"
    animationOut="fadeOutRight"
    onBackButtonPress={() => toggleModal()}
    onModalHide={() => eventManager.updateEventComponents()}
    header={
      <ModalHeader
        onBackButtonPress={() => toggleModal()}
        eventID={event.eventID.toString()}
        eventManager={eventManager}
        origin={origin}
        isModalVisible={isModalVisible}
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
                <PillBadge category={category} from="Modal" />
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
  viewWithSpacing: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scale(15),
  },
});

EventModal.propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  eventManager: PropTypes.instanceOf(EventsManager).isRequired,
  event: PropTypes.instanceOf(Event).isRequired,
  origin: PropTypes.string.isRequired,
};

export default EventModal;
