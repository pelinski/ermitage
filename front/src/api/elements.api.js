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

export const updateFolderLayout = async ({ folder, layout }) => {
  const res = await foldersApi.post(`/update/${folder}/layout`, { layout });
  return res;
}

export const getFolderLayout = async ({ folder, folderUsername }) => {
  const res = await foldersApi.get(`/${folderUsername}/${folder}/layout`);
  return res;
}


export const changeFolderPrivacy = async ({ folder, isPrivate }) => {
  const res = await foldersApi.post(`/${folder}/privacy`, { isPrivate });
  return res;
}

//ELEMENTS

//must upload only to folder
export const uploadText = async ({ text, folder }) => {
  const res = await elementsApi.post(`/upload/${folder}/text`, { text });
  return res;
};

export const editText = async ({ id, text }) => {
  const res = await elementsApi.post(`/edit/text`, { id, text });
  return res;
}


export const uploadImage = async ({ image, folder }) => {
  const data = new FormData();
  data.append("image", image);
  const res = await elementsApi.post(`/upload/${folder}/image`, data);
  return res
};

export const uploadAudio = async ({ audio, folder }) => {
  const data = new FormData();
  data.append("audio", audio);
  const res = await elementsApi.post(`/upload/${folder}/audio`, data);
  return res
};


//must retrieve only from folder
export const getElements = async ({ folder, folderUsername }) => {
  const res = await elementsApi.get(`/${folderUsername}/${folder}`);
  return res;
}

//if file, remove also from cloudinary
export const removeElement = async ({ element }) => {
  if (element.type == "image") {
    await elementsApi.post(`/cloudinary/delete`, { public_id: element.image.public_id })
  }
  if (element.type == "audio") {
    await elementsApi.post(`/cloudinary/delete`, { public_id: element.audio.public_id })
  }
  const res = await elementsApi.delete(`/${element._id}`);
  return res;
}

