import { API } from "./API"

export const addPet = async (data) => {
  const response = await API.post("/add/pets", data)
  return response?.data
}

export const updatePet = async (data, filter) => {
  let filterStr = ''
  Object.keys(filter).map(f => {
    filterStr += (filterStr ? " AND " : "") + f + "='" + filter[f] + "'"
  })
  filterStr = encodeURIComponent(filterStr)
  const response = await API.post(`/update/products&filter=${filterStr}`, data)
  return {id: filter.id}
}

export const addImages = async (data) => {
  const response = await API.post("/add_multiple/images", data)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message)
  return true
}

export const getPet = async (id) => {
  let filterStr = `p.id=${id}`
  const { data } = await API.get(`/get/pets&filter=${filterStr}`)
  return data?.data[0];
}

export const getPets = async (filter, page, user = null) => {
	let filterStr = ''
  Object.keys(filter).map(f => {
    filterStr += (filterStr ? " AND " : "") + filter[f]
  })
  filterStr = encodeURIComponent(filterStr)
  user = user ? `&user=${user}` : ''
  const { data } = await API.get(`/get/pets&filter=${filterStr}${user}&page=${page.page}&rows=${page.rows}`)
  return {total: data.total, data: data.data, card: 'pet'};
}