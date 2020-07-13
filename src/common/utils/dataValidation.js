// Delete this when more validation functions are added
/* eslint-disable import/prefer-default-export */

import * as yup from "yup";

/**
 * Contains all data validation for simple data formats, such as emails
 * and times
 */

const EMAIL_SCHEMA = yup
  .string()
  .email()
  .required();

/**
 * Returns whether or not the given email is valid
 * @param {string} email The email you want to test
 * @returns true if the email is valid, false otherwise
 */
export function validateEmail(email) {
  return EMAIL_SCHEMA.isValidSync(email, { strict: true });
}
