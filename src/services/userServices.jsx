import axios from "axios"
import Cookies from "js-cookie"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"

import { API } from "./API"
import { updateUser } from "@store/slices/usersSlice"
import { saveJSON, getJSON, getAllJSON } from "@utils/useJSON"

export const getUserGoogle = async (token) => {
  const res = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  return res.data;
};
export const authUser = async (data) => {
  //const response = getJSON("users", data);
  const response = await API.post("/login/", data)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message);
  return response?.data?.id;
};
export const createUser = async (data) => {
  //const response = saveJSON("users", data);
  const response = await API.post("/register/", data)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message);
  return response?.data?.id;
};

export const addMaterials = async (data) => {
  //const response = saveJSON("materials", data, "add");
  const response = await API.post("/add/materials", data)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message);
  return true;
};

export const addImages = async (data) => {
  //const response = saveJSON("images", data, "add");
  const response = await API.post("/add/images", data)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message);
  return true;
};

export const logoutUser = async () => {
  Cookies.remove('edgActiveUser')
  //await API.post("/logout")

  return true;
};
export const recoverUser = async (data, validate) => {
  const response = saveJSON("users", data, "update", validate);
  //await API.post("/register", data)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message);
  return true;
};
export const getUser = async (id) => {
//   const data = await getJSON("users");
//   data.images = await getAllJSON("images", { user: data.id });
//   data.materials = await getAllJSON("materials", { user: data.id });
  Cookies.set('edgActiveUser', id)
  const { data } = await API.get(`/user/${id}`)
  return data.data;
};
export const getUsers = async () => {
  const data = await getAllJSON("users");
  //const res = await API.get("/users")
  return res.data;
};
// export const getUser = async (name) => {
//   const url = `https://api.github.com/users/${name}`;
//   const res = await fetch(url);
//   const data = await res.json();
//   return data;
// };
