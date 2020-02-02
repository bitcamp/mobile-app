export default function isValidEmail(email) {
  const emailRegex = RegExp("^.+@.+..+$");
  if (emailRegex.test(email)) {
    return email;
  }
  return null;
}
