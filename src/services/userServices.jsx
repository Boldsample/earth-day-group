import axios from "axios"
import Cookies from "js-cookie"
import { toast } from "react-toastify"

import { API } from "./API"
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
}

export const authUser = async (formData) => {
  try {
    const {data} = await API.post("/login/", formData)
    Cookies.set('edgActiveUser', data?.id)
    return data
  } catch ({response}) {
    return response.data
  }
}

export const checkUser = async (formData) => {
  try {
    const {data} = await API.post("/check_user/", formData)
    return data
  } catch ({response}) {
    return response.data
  }
}

export const createUser = async (formData) => {
  try {
    const {data} = await API.post("/register/", formData)
    Cookies.set('edgActiveUser', data?.id)
    return data
  } catch ({response}) {
    return response.data
  }
}

export const updateUser = async (data, filter) => {
  let filterStr = ''
  Object.keys(filter).map(f => {
    filterStr += (filterStr ? " AND " : "") + f + "='" + filter[f] + "'"
  })
  filterStr = encodeURIComponent(filterStr)
  const response = await API.post(`/update/users&filter=${filterStr}`, data)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message)
  return filter.id
}

export const addMaterials = async (data) => {
  try {
    const { data } = await API.post("/add_multiple/materials", formData)
    return true
  } catch ({response}) {
    return response.data
  }
}

export const addImages = async (formData) => {
  try {
    console.log(formData)
    await API.post("/add_multiple/images", formData)
    return true
  } catch ({response}) {
    console.log('test')
    return response.data
  }
}

export const getNotifications = async (filter) => {
  const response = await API.get(`/get/notifications&user=${filter.user}&last=${filter.date}`)
  return response?.data?.data
}

export const logoutUser = async () => {
  Cookies.remove('edgActiveUser')
  //await API.post("/logout")

  return true
}

export const recoverUser = async (data, validate) => {
  const response = saveJSON("users", data, "update", validate)
  //await API.post("/register", data)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message)
  return true
}

export const getUser = async (id) => {
  //   const data = await getJSON("users")
  //   data.images = await getAllJSON("images", { user: data.id })
  //   data.materials = await getAllJSON("materials", { user: data.id })
  const { data } = await API.get(`/user/${id}`)
  return data.data
}

export const getUsers = async (filter = {}) => {
  //const data = await getAllJSON("users")
  let filterStr = ''
  Object.keys(filter).map(f => {
    filterStr += (filterStr ? " AND " : "") + f + "='" + filter[f] + "'"
  })
  filterStr = encodeURIComponent(filterStr)
  const response = await API.get(`/get/users&filter=${filterStr}`)
  return response?.data?.data
}