import React, { Component } from "react";
import PhotoView from "react-native-photo-view";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import FullScreenModal from "./FullScreenModal";

import AltModalHeader from "./AltModalHeader";
import CustomScheduleTabBar from "../schedule/CustomScheduleTabBar";
import { colors } from "../Colors";
import Images from "../../../assets/imgs";
import { getDeviceWidth } from "../../utils/sizing";

export default class MapModal extends Component {
  // TODO: I removed the use of rn-fetch blob to get it to build on expo, since that module isn't compatible with
  // expo.
  constructor() {
    super();
    this.state = {
      floors: {
        // 1: Images.floor1,
        // 2: Images.floor2,
        // 3: Images.floor4,
        // Parking: Images.parking
      },
    };
    // this.setFloors();
  }

  // async setFloors() {
  //   await RNFetchBlob.session('floorMaps').dispose().then(() => {console.log("Removed all files in cache.")});
  //   [1, 2, 3, 'Parking'].map(floorNumber => {
  //     RNFetchBlob
  //       .config({
  //         fileCache : false,
  //         // by adding this option, the temp files will have a file extension
  //         appendExt : 'png',
  //         session: 'floorMaps',
  //       })
  //       .fetch('GET', 'https://raw.githubusercontent.com/bitcamp/bitcamp-app-2019/master/assets/imgs/floor-maps/' + (floorNumber === 'Parking' ? '' : 'Floor_') + `${floorNumber}.png`, {
  //       })
  //       .then((res) => {
  //         currFloors = this.state.floors;
  //         currFloors[floorNumber] = 'https://raw.githubusercontent.com/bitcamp/bitcamp-app-2019/master/assets/imgs/floor-maps/' + (floorNumber === 'Parking' ? '' : 'Floor_') + `${floorNumber}.png`;
  //         this.setState({floors: currFloors});
  //       }).catch((error) => {
  //         console.log(error);
  //         currFloors = this.state.floors;
  //         currFloors[floorNumber] = null;
  //         this.setState({floors: currFloors});
  //       });
  //     });
  // }

  // componentDidMount() {
  // }

  render() {
    const { isModalVisible, toggleModal } = this.props;
    const { floors } = this.state;
    const renderedFloors = [1, 2, 3, "Parking"].map(floorNumber => {
      if (floors[floorNumber] === null) {
        return (
          <PhotoView
            key={floorNumber}
            tabLabel={`${
              floorNumber === "Parking" ? "" : "Floor "
            }${floorNumber}`}
            source={Images.not_found}
            minimumZoomScale={1}
            maximumZoomScale={8}
            androidScaleType="fitCenter"
            style={styles.photo}
          />
        );
      }
      return (
        <PhotoView
          key={floorNumber}
          tabLabel={`${
            floorNumber === "Parking" ? "" : "Floor "
          }${floorNumber}`}
          source={floors[floorNumber]}
          minimumZoomScale={1}
          maximumZoomScale={8}
          androidScaleType="fitCenter"
          style={styles.photo}
        />
      );
    });

    return (
      <FullScreenModal
        isVisible={isModalVisible}
        backdropColor={colors.backgroundColor.dark}
        onBackButtonPress={toggleModal}
        contentStyle={styles.modalContainer}
        header={
          <AltModalHeader
            title="Map"
            rightText="Done"
            rightAction={toggleModal}
          />
        }
      >
        <ScrollableTabView
          renderTabBar={() => <CustomScheduleTabBar />}
          style={styles.floorContainer}
        >
          {renderedFloors}
        </ScrollableTabView>
      </FullScreenModal>
    );
  }
}

const styles = StyleSheet.create({
  floorContainer: {
    height: 530,
  },
  modalContainer: { padding: 0 },
  photo: {
    backgroundColor: colors.backgroundColor.dark,
    flex: 1,
    width: getDeviceWidth(),
  },
});

MapModal.propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};
