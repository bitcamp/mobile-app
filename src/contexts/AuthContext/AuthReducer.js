/**
 * Handles state for the auth context, including user information and token
 * values.
 *
 * @param {object} prevState Previous state of the reducer
 * @param {object} action Action to perform
 * @param {"RESTORE_USER_INFO"|"SIGN_IN"|"SIGN_IN_ERROR"|"SIGN_OUT"} action.type Which action to perform
 */
export default function authReducer(prevState, action) {
  switch (action.type) {
    // Try to fetch the old token
    case "RESTORE_USER_INFO":
      return {
        ...prevState,
        userToken: action.userToken,
        user: action.user,
        isLoadingToken: false,
      };

    // Signs the user into the app
    case "SIGN_IN":
      return {
        ...prevState,
        userToken: action.userToken,
        user: action.user,
      };

    // Signs the user out of the app
    case "SIGN_OUT":
      return {
        ...prevState,
        userToken: null,
        user: null,
      };

    default:
      throw new Error(`Unhandled auth reducer action type: ${action.type}`);
  }
}

/**
 * Initial state for the reducer
 */
export const initialState = {
  isLoadingToken: true,
  userToken: null,
  user: null,
};
