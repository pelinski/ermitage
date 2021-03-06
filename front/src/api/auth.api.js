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
  return async () => {
    console.log("User is now logged out");
    // Remove user from React User State context
    userState.setUser(null);
    // Remove cookie from backend and frontend
    return doLogout();
  };
};

const api = axios.create({
  //baseURL: "http://localhost:3000/auth",
  baseURL: `${process.env.BACK_URL}/auth`,
  withCredentials: true
});


export const doSignup = async ({ username, password, email }) => {
  console.log(`Registering user into database...`);
  try {
    const res = await api.post("/signup", {
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
  console.log(process.env.BACK_URL)
  console.log("Do Login");
  try {
    const res = await api.post("/login", {
      username,
      password
    });
    return res;
  }
  catch (e) {
    return e.response;
  }
};

export const doLogout = async () => {
  const res = await api.post("/logout");
  return res;
};

export const whoami = async () => {
  const res = await api.get("/whoami");
  return res;
};

// Profile

export const uploadProfilePicture = async ({ profilePic }) => {
  const data = new FormData();
  data.append("profilepic", profilePic);
  const res = await api.post(`/upload/profilepic`, data);
  return res
}

export const updateProfileBio = async ({ bio }) => {
  const res = await api.post("/update/bio", { bio });
  return res
}

export const searchUser = async ({ query }) => {
  const res = await api.get(`/search/${query}`);
  return res
}


// Helpers
export const colorSecurityPassword = ({ password }) => {
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

  if (strongRegex.test(password)) {
    return "lime"
  } else if (mediumRegex.test(password)) {
    return "orange"
  } else {
    return "red";
  }

}

