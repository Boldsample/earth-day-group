import axios from "axios"
import Cookies from "js-cookie"

import { API } from "./API"

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

export const checkUser = async (formData, id) => {
  try {
    const checkData = id ? `&id=${id}` : ''
    const {data} = await API.post(`/check/user${checkData}`, formData)
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

export const updateUser = async (data, filter, id) => {
  let filterStr = ''
  Object.keys(filter).map(f => {
    filterStr += (filterStr ? " AND " : "") + f + "='" + filter[f] + "'"
  })
  filterStr = encodeURIComponent(filterStr)
  const checkData = id ? `&id=${id}` : ''
  try {
    const response = await API.post(`/update/users&filter=${filterStr}${checkData}`, data)
    return {id: filter?.id, response: response.data.response}
  } catch ({response}) {
    return response.data
  }
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

export const recoverUser = async (formData) => {
  try {
    const {data} = await API.post("/recover/", formData)
    return data
  } catch ({response}) {
    return response.data
  }
}

export const getUser = async (id, user = null) => {
  const type = user ? `&user=${user}` : ''
  let filterStr = isNaN(id) ? `u.username='${id}'` : `u.id='${id}'`
  filterStr = encodeURIComponent(filterStr)
  const { data } = await API.get(`/get/users&filter=${filterStr}&type=${type}&single=1`)
  return data?.data[0] || []
}

export const getUsers = async (filter = {}, type = 'min', user = null, page = null, ex = false) => {
	let filterStr = ''
  Object.keys(filter).map(f => {
    filterStr += (filterStr ? " AND " : "") + filter[f]
  })
  filterStr = encodeURIComponent(filterStr)
  type += user ? `&user=${user}` : ''
  if(ex)
    window.open(`${API.getUri()}/get/users/export&filter=${filterStr}&type=${type}`, '_blank', 'noopener,noreferrer')
  else{
    const { data } = await API.get(`/get/users&filter=${filterStr}&type=${type}&page=${page?.first}&rows=${page?.rows}`)
    return {total: data.total, data: data.data, card: 'company'};
  }
}

export const followUser = async (formData) => {
  const {data} = await API.post(`/follow/`, formData)
  return data?.id
}