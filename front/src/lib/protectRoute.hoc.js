import React from "react";
import { useUser, useUserIsLoading } from "./auth.api";
//https://reacttraining.com/react-router/web/guides/quick-start
import { Redirect } from "react-router-dom";

const ProtectedPagePlaceholder = () => <div>PROTECTED PAGE</div>;

// This is a HOC -> High Order Component
export const withProtected = (
  Component,
  { redirect = true, redirectTo = "/auth/login" } = {} // options are always present
) => props => {
  const user = useUser();
  const isUserLoading = useUserIsLoading();

  if (user) {
    // If we have a user, then render the component
    return <Component />;
  } else {
    // If the user auth backend is loading (because there's no user yet) render the placeholder
    if (isUserLoading) return <ProtectedPagePlaceholder />;
    else {
      // If the auth has been completed and there is no user then redirect or render placehoder
      // depending on choosen option
      if (redirect) {
        return <Redirect to={redirectTo} />;
      } else {
        return <ProtectedPagePlaceholder />;
      }
    }
  }
};
