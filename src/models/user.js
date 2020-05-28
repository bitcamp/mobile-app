import * as yup from "yup";

const userSchema = yup.object().shape({
  id: yup
    .number()
    .required()
    .positive()
    .integer(),
  email: yup
    .string()
    .email()
    .required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  provider: yup.string().required(),
  uid: yup
    .string()
    .required()
    .required(),
  user_type: yup.string().required(),
  rsvp: yup.bool().required(),
  check_in: yup.bool().required(),
  project_id: yup.number().nullable(),
  slack_id: yup.number().nullable(),
  allow_password_change: yup.bool(),
});

const validateUser = user => {
  return userSchema.validate(user);
};

export default validateUser;
