import { API } from "./API"

export const sendMessage = async (data, sendNotificationMessage = () => {}) => {
  const response = await API.post("/add/chat", data)
  if(data?.outgoing)
  	sendNotificationMessage(data?.outgoing, 'Nuevo mensaje')
  return true
}
export const updateMessage = async (data, filter, sendNotificationMessage = () => {}) => {
  let filterStr = ''
  Object.keys(filter).map(f => {
    filterStr += (filterStr ? " AND " : "") + f + "='" + filter[f] + "'"
  })
  filterStr = encodeURIComponent(filterStr)
  const response = await API.post(`/update/chat&filter=${filterStr}`, data)
  return {id: filter.id}
}
export const getMessages = async (filter) => {
  const response = await API.get(`/get/chat&user=${filter.user}&contact=${filter.contact}&last=${filter.last}`)
  return response?.data?.data
}