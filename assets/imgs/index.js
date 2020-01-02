// Use this file to staticly import images https://stackoverflow.com/questions/33907218/react-native-use-variable-for-image-file

const Images = {
    // Banners
    banner_food: require('./event-banners/food.jpg'),
    banner_demo: require('./event-banners/demo.jpg'),
    banner_main: require('./event-banners/main.jpg'),
    banner_campfire: require('./event-banners/campfire.jpg'),
    banner_sponsor: require('./event-banners/sponsor.jpg'),
    banner_mentor: require('./event-banners/mentors.jpg'),
    banner_mini: require('./event-banners/minievent.jpg'),
    banner_workshop: require('./event-banners/workshop.jpg'),
    banner_ceremony: require('./event-banners/ceremony.jpg'),
    banner_colorwar: require('./event-banners/colorwar.jpg'),

    // Logos
    bitcamp_logo: require('./bitcamp-logo.png'),

    // Floor Maps
    floor1: require('./floor-maps/Floor_1.png'),
    floor2: require('./floor-maps/Floor_2.png'),
    floor3: require('./floor-maps/Floor_3.png'),
    parking: require('./floor-maps/Parking.png'),
    not_found: require('./floor-maps/not_found.png')
};

export default Images;
