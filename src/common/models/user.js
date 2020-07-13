import * as yup from "yup";
import { HACKER_ROLES } from "../../hackathon.config";

const USER_SCHEMA = yup
  .object()
  .shape({
    id: yup
      .number()
      .required()
      .positive()
      .integer(),
    email: yup
      .string()
      .email()
      .required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    userType: yup
      .mixed()
      .oneOf(HACKER_ROLES)
      .required(),
    rsvp: yup.string().required(),
    checkIn: yup.string().required(),
    team: yup
      .mixed()
      .oneOf(["red", "green", "blue"])
      .required(),
  })
  .required();

/**
 * Checks if a user object is valid
 */
export const validateUser = user => {
  return USER_SCHEMA.isValidSync(user, { strict: true });
};

/**
 * Strips extra data from the user object
 */
export const castUser = user => {
  return USER_SCHEMA.cast(user, { strict: true, stripUnknown: true });
};
