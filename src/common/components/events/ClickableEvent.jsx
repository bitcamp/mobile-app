import React from "react";
import { ViewPropTypes } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";
import Event from "../../../contexts/EventsContext/Event";

/**
 * A card that will reveal a modal with extra info about an event when clicked
 */
export default function ClickableEvent({ style, event, origin, children }) {
  const navigation = useNavigation();

  const openModal = () => navigation.navigate("event modal", { event, origin });

  return (
    <TouchableOpacity onPress={openModal} activeOpacity={0.7} style={style}>
      {children}
    </TouchableOpacity>
  );
}

ClickableEvent.propTypes = {
  event: PropTypes.instanceOf(Event).isRequired,
  origin: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
  children: PropTypes.node,
};

ClickableEvent.defaultProps = {
  style: null,
  children: null,
};
