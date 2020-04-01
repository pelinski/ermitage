import axios from "axios";
import React, { useContext } from "react";

export const UserContext = React.createContext();

export const useUser = () => {
  const userState = useContext(UserContext);
  return userState.user;
};

export const useUserSetter = () => {
  const userState = useContext(UserContext);
  return userState.setUser;
};

export const useUserIsLoading = () => {
  const userState = useContext(UserContext);
  return userState.loading;
};

export const useUserLogout = () => {
  const userState = useContext(UserContext);

  // NOTE: This returned function is "handleLogout"
  return async () => {
    console.log("log out!");
    // Remove user from React User State context
    userState.setUser(null);
    // Remove cookie from backend and frontend
    return doLogout();
  };
};

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});

export const doSignup = async ({ username, password, email }) => {
  // Axios post a ruta /auth/signup en servidor
  // para crear un usuario en mongodb
  console.log(`Registering user into database...`);
  try {
    const res = await api.post("/auth/signup", {
      username,
      password,
      email
    });
    return res;
  }
  catch (e) {
    return e.response
  }
};

export const doLogin = async ({ username, password }) => {
  console.log("Do Login");
  const res = await api.post("/auth/login", {
    username,
    password
  });
  return res;
};

export const doLogout = async () => {
  const res = await api.get("/auth/logout");
  return res;
};

export const whoami = async () => {
  const res = await api.get("/auth/whoami");
  return res;
};
