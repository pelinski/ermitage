import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/dashboard",
  withCredentials: true
});

export const getFolders = async () => {
  const res = await api.get("/folders");
  return res;
}
export const createFolder = async({folder}) => {
  try {
    const res = await api.post(`/create/${folder}`);
    return res;
  }
  catch (e) {
    return e.response;
  }
}

export const deleteFolder = async({folder}) => {
  const res = await api.delete(`/${folder}`);
  return res;
}

export const updateDashboardLayout  = async({layout}) => {
  const res = await api.post(`/update/layout`, {layout});
  return res;
}

export const getDashboardLayout  = async() => {
  const res = await api.get(`/layout`);
  return res;
}




/*
export const updateFolderLayout = async ({folder,layout}) => {
  const res = await api.post(`/update/folder/${folder}`,{layout});
  return res;
}*/