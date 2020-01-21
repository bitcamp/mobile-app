import React, { Component, Fragment } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../Colors";
import EventModal from "../events/EventModal";
import EventStar from "../events/EventStar";
import PillBadge from "../PillBadge";
import { H3, H4 } from "../Text";

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4,
    height: 20,
    marginTop: 5,
  },
  badgeTxt: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: -2,
  },
  column: {
    flexDirection: "column",
    paddingHorizontal: 0,
  },
  disabled: {
    opacity: 0.3,
  },
  eventcard: {
    padding: 12.5,
  },
  row: {
    flexDirection: "row",
  },
});

export default class EventDescription extends Component {
  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      favorited: false,
      isModalVisible: false,
    };
  }

  toggleModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  renderModal() {
    return (
      <EventModal
        isModalVisible={this.state.isModalVisible}
        toggleModal={this.toggleModal}
        origin={this.props.origin}
        {...this.props}
      />
    );
  }

  render() {
    const { event, eventManager } = this.props;
    return (
      <>
        {this.renderModal()}
        <TouchableOpacity
          style={this.props.style}
          onPress={() => this.toggleModal()}
        >
          <View style={[styles.row, styles.eventcard]}>
            <View style={[styles.col, { flex: 4 }]}>
              <H3 style={{ fontSize: 20 }}>{event.title}</H3>
              <H4 style={{ fontSize: 17.5, color: colors.textColor.light }}>
                {event.location}
              </H4>
              <View style={{ alignItems: "flex-start", flexDirection: "row" }}>
                {event.category.map((category, index) => (
                  <View
                    style={{ marginRight: 5 }}
                    key={event.title + index.toString()}
                  >
                    <PillBadge category={category} from="Description" />
                  </View>
                ))}
              </View>
            </View>
            <View
              style={[
                styles.row,
                { flex: 1, justifyContent: "flex-end", alignItems: "center" },
              ]}
            >
              <EventStar
                ref={myStar => {
                  this.myStar = myStar;
                  eventManager.registerHeartListener(myStar);
                }}
                eventID={event.eventID.toString()}
                eventManager={eventManager}
                origin="Event Description"
              />
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  }

  componentWillUnmount() {
    this.props.eventManager.removeHeartListener(this.myStar);
  }
}
