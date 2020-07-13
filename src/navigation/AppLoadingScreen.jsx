import React, { useEffect } from "react";
import { CenteredActivityIndicator } from "../common/components/Base";
import { useAuthActions } from "../contexts/AuthContext/AuthHooks";

/**
 * Displays a loading indicator while user information is being fetched and validated.
 */
export default function AppLoadingScreen() {
  const { fetchUserInfo } = useAuthActions();

  // Fetch the user info on mount. When this process is done,
  // the navigator will automatically redirect the user to the main app screen
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return <CenteredActivityIndicator />;
}
