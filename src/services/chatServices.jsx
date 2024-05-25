import axios from "axios"
import Cookies from "js-cookie"
import { toast } from "react-toastify"

import { API } from "./API"

export const sendMessage = async (data) => {
  const response = await API.post("/add/chat", data)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message)
  return true
}
export const getMessages = async (filter) => {
  const response = await API.get(`/get/chat&user=${filter.user}&contact=${filter.contact}&last=${filter.last}`)
  return response?.data?.data
}