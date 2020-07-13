import request from "../../common/utils/request";
import { BASE_URL } from "../../api.config";
import mockFetch from "../../common/mockData/mockFetch";
import mockUser from "../../common/mockData/mockUser";
import { validateUser, castUser } from "../../common/models/User";

/**
 * Logs in a user given their email & password pair.
 *
 * @param {string} email The user's email
 * @param {string} password The user's password
 * @returns An object containing user's authentication token (`.userToken`) and
 * user object (`.user`)
 */
export async function logIn(email, password) {
  // We use `mockFetch()` instead of `request()` because we need access to the raw
  // response headers
  const response = await mockFetch(`${BASE_URL}/login`, {
    body: JSON.stringify({ email, password }),
    responseData: mockUser,
    responseHeaders: { "auth-token": "someRandomTokenString12345" },
  });

  // Ensure the response came back alright
  if (!response.ok) {
    if (response.status >= 400 && response.status) {
      throw new Error("Login error: Email or password were incorrect");
    } else {
      throw new Error("Login error: Network request failed");
    }
  }

  // Start assembling the return object
  const userInfo = {
    userToken: response.headers["auth-token"],
  };

  // Parse the user data
  try {
    const user = await response.json();
    userInfo.user = castUser(user);
  } catch (e) {
    throw new Error("Login Error: Couldn't parse the user data");
  }

  // Ensure the token is a string and the user object is valid
  if (!validateUser(userInfo.user) || typeof userInfo.userToken !== "string") {
    throw new Error("Login Error: User response data was invalid");
  }

  return userInfo;
}

/**
 * Returns whether the user's token is valid or not
 * @param {string} authToken The user's authorization token
 * @returns true if the user's token is valid, false otherwise
 */
export async function validateToken(authToken) {
  // Any falsy tokens are invalid
  if (!authToken) return false;

  try {
    await request("/login/validate-token", { authToken });
    return true;
  } catch (e) {
    // If the request fails (either due to a network or an authorization
    // error, return false)
    return false;
  }
}
