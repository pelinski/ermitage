import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/elements",
  withCredentials: true
});


//ELEMENTS

//must upload only to folder
export const uploadText = async ({text, folder}) => {
  const res = await api.post("/upload/text", {text,folder});
  return res;
};


//must retrieve only from folder
export const retrieveText = async ({folder}) => {
  const res =  await api.get(`/${folder}`);
  return res;
}
