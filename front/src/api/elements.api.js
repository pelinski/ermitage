import axios from "axios";

const elementsApi = axios.create({
  baseURL: "http://localhost:3000/elements",
  withCredentials: true
});

const foldersApi = axios.create({
  baseURL: "http://localhost:3000/dashboard",
  withCredentials: true
});

//FOLDER: EDIT NAME, GET LAYOUT, UPDATE LAYOUT

export const updateFolderLayout  = async({folder,layout}) => {
  const res = await foldersApi.post(`/update/${folder}/layout`, {layout});
  return res;
}

export const getFolderLayout  = async({folder}) => {
  const res = await foldersApi.get(`/${folder}/layout`);
  return res;
}



//ELEMENTS

//must upload only to folder
export const uploadText = async ({text, folder}) => {
  const res = await elementsApi.post("/upload/text", {text,folder});
  return res;
};

//must retrieve only from folder
export const getText = async ({folder}) => {
  const res =  await elementsApi.get(`/${folder}`);
  return res;
}

export const removeText = async ({id}) => {
  const res = await elementsApi.delete(`/${id}`);
  return res;
}

