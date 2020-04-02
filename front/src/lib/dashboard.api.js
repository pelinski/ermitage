import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});


//must upload only to folder
export const uploadText = async ({text, folder}) => {
  console.log("UploadText");
  const res = await api.post("/dashboard/upload/text", {text,folder});
  return res;
};


//must retrieve only from folder
export const retrieveText = async ({folder}) => {
  const res =  await api.get(`/dashboard/${folder}`);
  return res;
}

export const getFolders = async () => {
  const res = await api.get("/dashboard/folders");
  return res;
}