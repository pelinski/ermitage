import React from "react";

const api = axios.create({
  baseURL: "http://localhost:3000"
});

export const uploadText = async ({ element }) => {
  console.log("Do Login");
  const res = await api.post("/elements/upload", element);
  return res;
};
