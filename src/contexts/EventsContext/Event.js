import * as yup from "yup";
import moment from "moment";
import { getTimeOfDay, isValidTime } from "../../utils/time";
import { EVENT_CATEGORIES } from "../../hackathon.config";
import { getImage, getColor } from "../../style.config";

/**
 * A hackathon event
 */
export default class Event {
  /**
   * @param {Object} rawEventData a PRE-VALIDATED event object. You should not create an event with
   * invalid event object.
   */
  constructor({
    id,
    title,
    description,
    caption,
    location,
    categories,
    startTime,
    endTime,
    pointValue,
  }) {
    // Unique identifier
    this.id = id;

    // Name of the event, visible on every clickable event throughout the app
    this.title = title;

    // Full description of the event
    this.description = description;

    // A clever quip about the event
    this.caption = caption;

    // Room where the event takes place
    this.location = location;

    /**
     * List of categories ordered by decreasing relevance. The possible categories are listed below:
     * "main-event" = main events (e.g., Event check-in, Hacker Expo)
     * "food"       = food event (e.g., breakfast, dinner, late-night snack)
     * "mini-event" = smaller event, usually not hacking related (e.g., smash tourney, robot fights)
     * "workshop"   = programming/design workshop (e.g. intro to web dev, designing your app)
     * "sponsored"  = sponsored event (e.g., Firebase demo with Google)
     *
     * Ex: ["food", "sponsored"]
     */
    this.categories = categories;

    // Start time
    this.startTime = startTime;

    // End time
    this.endTime = endTime;

    // How many points a user earns for their team when they attend the envet
    this.pointValue = pointValue;
  }

  get startTimeFormatted() {
    return getTimeOfDay(this.startTime);
  }

  get endTimeFormatted() {
    return getTimeOfDay(this.endTime);
  }

  get hasPassed() {
    return moment().isAfter(this.endTime);
  }

  get timeRange() {
    return this.startTimeFormatted === this.endTimeFormatted
      ? this.startTimeFormatted
      : `${this.startTimeFormatted} - ${this.endTimeFormatted}`;
  }

  get primaryCategory() {
    return this.categories[0];
  }

  get color() {
    return getColor(this);
  }

  get image() {
    return getImage(this);
  }

  toString() {
    return `Event(${this.title})`;
  }
}

const DATE_STRING_VALIDATION_ARGS = [
  "is-date-string",
  // We disable this eslint rule because of how yup handles the second argument of `mixed.test()`
  // eslint-disable-next-line no-template-curly-in-string
  "${path} is not a valid date string",
  isValidTime,
];

/**
 * Used to validate the structure of raw event objects
 */
export const EVENT_SCHEMA = yup
  .object()
  .shape({
    id: yup
      .number()
      .positive()
      .integer()
      .required(),
    title: yup.string().required(),
    description: yup.string().default(""),
    caption: yup.string().default(""),
    location: yup.string().required(),
    categories: yup
      .array()
      .of(
        yup
          .mixed()
          .oneOf(EVENT_CATEGORIES)
          .required()
      )
      .required(),
    startTime: yup
      .string()
      .test(...DATE_STRING_VALIDATION_ARGS)
      .required(),
    endTime: yup
      .string()
      .test(...DATE_STRING_VALIDATION_ARGS)
      .required(),
    pointValue: yup
      .number()
      .positive()
      .integer()
      .required(),
  })
  .required();
