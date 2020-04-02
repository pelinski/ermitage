import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});


//must upload only to folder
export const uploadText = async ({text}) => {
  console.log("UploadText");
  const res = await api.post("/dashboard/upload/text", {text});
  return res;
};


//must retrieve only from folder
export const retrieveText = async () => {
  console.log("retrieve text");
  const res =  await api.get("/dashboard");
  return res;
}

export const getFolders = async () => {
  const res = await api.get("/dashboard/folders");
  return res;
}