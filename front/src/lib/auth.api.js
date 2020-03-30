import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});


export const doSignUp = async (user) => {
  const res = await api.post("/auth/signup", user);
  console.log("Created user");
  return res.data;
}

export const doLogIn = async (user) => {
  const res = await api.post("/auth/login", user);
  console.log("Logged in");
  return res.data;
}

export const editUser = async (editedUser) => {
  const res = await api.post("/auth/edit", editedUser);
  console.log("Logged out");
  return res.data;
}

export const uploadPic = async (pic) => {
  const res = await api.post("/auth/upload", pic);
  console.log("picture uploaded")
  return res.data;
}

export const doLogOut = async (user) => {
  const res = await api.post("/auth/logout", user);
  console.log("Logged out");
  return res.data;
}

export const isLoggedIn = async () => {
  const res = await api.get("/auth/loggedin");
  console.log("check if user is logged in");
  return res.data;
}

