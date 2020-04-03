import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/dashboard",
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

//FOLDERS
export const getFolders = async () => {
  const res = await api.get("/folders");
  return res;
}
export const createFolder = async({folder}) => {
  const res = await api.post(`/create/${folder}`);
  return res;
}

export const deleteFolder = async({folder}) => {
  const res = await api.post(`/delete/${folder}`);

  console.log(`${folder} deleted`)
  return res;
}
export const uploadLayout = async ({folder,layout}) => {
  const res = await api.post("/update/folder",{folder,layout});
  return res;
}