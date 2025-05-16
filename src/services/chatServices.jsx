import { API } from "./API"

export const sendMessage = async (data, sendNotificationMessage = () => {}) => {
  const response = await API.post("/add/chat", data)
  if(data?.incoming)
  	sendNotificationMessage(data?.incoming, 'Nuevo mensaje')
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
export const getMessages = async (filter, sendNotificationMessage = () => {}) => {
  const { user, contact, last, direction = 'forward' } = filter
  const response = await API.get(`/get/chat&user=${user}&contact=${contact}&last=${last}&direction=${direction}`)
  if (direction === 'forward')
    sendNotificationMessage(user, 'Mensaje leído')
  return response?.data?.data || []
}