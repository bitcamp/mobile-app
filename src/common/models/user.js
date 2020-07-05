import * as yup from "yup";

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
      .oneOf(["attendee", "mentor", "organizer", "admin"])
      .required(),
    rsvp: yup.string().required(),
    checkIn: yup.string().required(),
    team: yup
      .mixed()
      .oneOf(["red", "green", "blue"])
      .required(),
  })
  .required();

const validateUser = user => {
  return USER_SCHEMA.validate(user);
};

export default validateUser;
