import Images from "../assets/imgs";

// Event title regexes and their corresponding keys for config objects
const ceremonyRegex = [new RegExp(/ceremony/i), "ceremony"];
const expoRegex = [new RegExp(/expo a|expo b/i), "expo"];
const colorwarRegex = [new RegExp(/colorwar/i), "colorwar"];

const specialTitles = [ceremonyRegex, expoRegex, colorwarRegex];

/**
 * Given an event, determine what image should be used to represent it throughout the app
 * @param {Event} event A hackathon event
 * @returns a color string
 */
export function getColor(event) {
  const overlayColor = {
    "main-event": "#5996B3",
    "mini-event": "#496B7D",
    food: "#AB622A",
    workshop: "#A53C32",
    sponsored: "#544941",
    demo: "#645D54",
    ceremony: "#BBB35D",
    colorwar: "#405962",
    campfire: "#81581F",
  };

  let eventColor;

  for (let i = 0; !eventColor && i < specialTitles.length; i += 1) {
    const [titleRegex, simplifiedTitle] = specialTitles[i];

    if (titleRegex.test(event.title)) {
      eventColor = overlayColor[simplifiedTitle];
    }
  }

  return eventColor || overlayColor[event.primaryCategory];
}

/**
 * Given an event, determine what image should be used to represent it throughout the app
 * @param {Event} event A hackathon event
 * @returns a valid image source (can be plugged into <Image source={HERE} />)
 */
export function getImage(event) {
  let bannerType;

  for (let i = 0; !bannerType && i < specialTitles.length; i += 1) {
    const [titleRegex, simplifiedTitle] = specialTitles[i];

    if (titleRegex.test(event.title)) {
      bannerType = simplifiedTitle;
    }
  }

  return Images[`banner-${bannerType || event.primaryCategory}`];
}
