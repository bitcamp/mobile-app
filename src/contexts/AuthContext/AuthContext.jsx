import React, { createContext, useMemo, useReducer, useCallback } from "react";
import PropTypes from "prop-types";
import { AsyncStorage } from "react-native";
import authReducer, { initialState } from "./AuthReducer";
import { logIn, validateToken } from "./authUtils";

const AuthContext = createContext();
const AuthActions = createContext();

/**
 * Stores ther user's login status & information for the entire app.
 * Provides actions to sign the user into and out of the app.
 */
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Events API
   * All publicly available functions
   */

  // Signs the user in, or enters an error state if the request fails
  // Returns the user object on success
  // Throws an error if logging in failed
  const signIn = useCallback(async (username, password) => {
    // Let any sign in errors
    const { user, userToken } = await logIn(username, password);

    // Store user and token info to local storage
    AsyncStorage.multiSet([
      ["userToken", userToken],
      ["user", JSON.stringify(user)],
    ]).catch(e => {
      console.warn(
        `Auth error: couldn't locally store your user info: ${e.message}`
      );
    });

    dispatch({ type: "SIGN_IN", userToken, user });

    // Mostly, we return this value so that this function can be awaited
    return user;
  }, []);

  // Signs the user out
  const signOut = useCallback(() => {
    return AsyncStorage.multiRemove(["userToken", "user"]).finally(() =>
      dispatch({ type: "SIGN_OUT" })
    );
  }, []);

  // Restores the user information (token and user data) from local storage
  const fetchUserInfo = useCallback(async () => {
    let userToken;
    let user;

    try {
      // Extract the user and userToken values from the key/value array from local storage
      const userInfoArray = await AsyncStorage.multiGet(["user", "userToken"]);
      user = JSON.parse(userInfoArray[0][1]);
      [, [, userToken]] = userInfoArray;
    } catch (e) {
      // Restoring user info failed, do nothing
    }

    // Make the user info `null` if the user token is invalid
    const isTokenValid = await validateToken(userToken);

    if (!isTokenValid) {
      user = null;
      userToken = null;
    }

    // Ends the process of loading the user info
    dispatch({ type: "RESTORE_USER_INFO", userToken, user });
  }, []);

  // These are the actions that screens can perform
  const actions = useMemo(() => ({ signIn, signOut, fetchUserInfo }), [
    fetchUserInfo,
    signIn,
    signOut,
  ]);

  return (
    <AuthContext.Provider value={state}>
      <AuthActions.Provider value={actions}>{children}</AuthActions.Provider>
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthActions, AuthProvider };
