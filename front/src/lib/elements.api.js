import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});

export const uploadText = async ({text}) => {
  console.log("UploadText");
  const res = await api.post("/elements/upload/text", {text});
  return res;
};

export const retrieveText = async () => {
  console.log("retrieve text");
  const res =  await api.get("/elements");
  return res;
}