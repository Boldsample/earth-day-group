import { API } from "./API"

export const sendMessage = async (data) => {
  const response = await API.post("/add/chat", data)
  return true
}
export const getMessages = async (filter) => {
  const response = await API.get(`/get/chat&user=${filter.user}&contact=${filter.contact}&last=${filter.last}`)
  return response?.data?.data
}