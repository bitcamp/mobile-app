/* eslint-disable global-require */
// Use this file to staticly import images https://stackoverflow.com/questions/33907218/react-native-use-variable-for-image-file

const Images = {
  // Banners
  "banner-food": require("./event-banners/food.jpg"),
  "banner-demo": require("./event-banners/demo.jpg"),
  "banner-main-event": require("./event-banners/main.jpg"),
  "banner-campfire": require("./event-banners/campfire.jpg"),
  "banner-sponsored": require("./event-banners/sponsor.jpg"),
  "banner-mini-event": require("./event-banners/minievent.jpg"),
  "banner-workshop": require("./event-banners/workshop.jpg"),
  "banner-ceremony": require("./event-banners/ceremony.jpg"),
  "banner-colorwar": require("./event-banners/colorwar.jpg"),

  // Logos
  "hackathon-logo": require("./bitcamp-logo.png"),
  "error-logo": require("./error-logo.png"),

  // Floor Maps
  floor1: require("./floor-maps/Floor_1.png"),
  floor2: require("./floor-maps/Floor_2.png"),
  floor3: require("./floor-maps/Floor_3.png"),
  parking: require("./floor-maps/Parking.png"),
};

export default Images;
