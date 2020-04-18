import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:3000/dashboard",
  baseURL: `${process.env.BACK_URL}/dashboard`,
  withCredentials: true
});

export const getFolders = async () => {
  const res = await api.get("/folders");
  return res;
}
export const createFolder = async ({ folder }) => {
  try {
    const res = await api.post(`/create/${folder}`);
    return res;
  }
  catch (e) {
    return e.response;
  }
}

export const deleteFolder = async ({ folderId }) => {
  const res = await api.delete(`/${folderId}`);
  return res;
}

export const updateDashboardLayout = async ({ layout }) => {
  const res = await api.post(`/update/layout`, { layout });
  return res;
}

export const getDashboardLayout = async () => {
  const res = await api.get(`/layout`);
  return res;
}

export const addFolderToDashboard = async ({ folderId }) => {
  const res = await api.post(`/add/folder/${folderId}`);
  return res;
}