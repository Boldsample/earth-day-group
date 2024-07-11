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
  return {id: filter.id}
}

export const addMaterials = async (formData) => {
  try {
    await API.post("/add_multiple/materials", formData)
    return true
  } catch ({response}) {
    return response?.data
  }
}

export const addImages = async (formData) => {
  try {
    await API.post("/add_multiple/images", formData)
    return true
  } catch ({response}) {
    return response.data
  }
}

export const getNotifications = async (filter, limit = 0) => {
  const response = await API.get(`/get/notifications&user=${filter.user}&limit=${limit}`)
  return response?.data?.data
}

export const logoutUser = async () => {
  Cookies.remove('edgActiveUser')
  return true
}

export const recoverUser = async (data, validate) => {
  const response = saveJSON("users", data, "update", validate)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message)
  return true
}

export const getUser = async (id, user = null) => {
  const type = user ? `&user=${user}` : ''
  let filterStr = isNaN(id) ? `u.username='${id}'` : `u.id='${id}'`
  filterStr = encodeURIComponent(filterStr)
  const { data } = await API.get(`/get/users&filter=${filterStr}&type=${type}&single=1`)
  return data?.data[0] || []
}

export const getUsers = async (filter = {}, type = 'min', user = null, page = null) => {
	let filterStr = ''
  Object.keys(filter).map(f => {
    filterStr += (filterStr ? " AND " : "") + filter[f]
  })
  filterStr = encodeURIComponent(filterStr)
  type += user ? `&user=${user}` : ''
  type += page ? `&page=${page?.page * page?.rows}&rows=${page.rows}` : ''
  const { data } = await API.get(`/get/users&filter=${filterStr}&type=${type}`)
  return {total: data.total, data: data.data, card: 'company'};
}

export const followUser = async (formData) => {
  const {data} = await API.post(`/follow/`, formData)
  return data?.id
}