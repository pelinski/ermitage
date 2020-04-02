import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000"
});

export const uploadText = async ({ element }) => {
  console.log("UploadText");
  const res = await api.post("/elements/upload", element);
  return res;
};

export const retrieveText = async () => {
  console.log("retrieve text");
  const res =  await api.get();
  return res;
}