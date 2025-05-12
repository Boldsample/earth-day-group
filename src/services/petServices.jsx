import { API } from "./API"

export const addPet = async (data) => {
  const response = await API.post("/add/pets", data)
  console.log(response)
  return response?.data
}

export const updatePet = async (data, filter) => {
  let filterStr = ''
  Object.keys(filter).map(f => {
    filterStr += (filterStr ? " AND " : "") + f + "='" + filter[f] + "'"
  })
  filterStr = encodeURIComponent(filterStr)
  const response = await API.post(`/update/pets&filter=${filterStr}`, data)
  return {id: filter.id}
}

export const addImages = async (data) => {
  const response = await API.post("/add_multiple/images", data)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message)
  return true
}

export const getPet = async (id, user = null) => {
  let filterStr = `p.id=${id}`
  user = user ? `&user=${user}` : ''
  const { data } = await API.get(`/get/pets&filter=${filterStr}${user}&single=1`)
  return data?.data[0];
}

export const getPets = async (filter, page, user = null, ex = false) => {
  let filterStr = ''
  Object.keys(filter).map(f => {
    filterStr += (filterStr ? " AND " : "") + filter[f]
  })
  filterStr = encodeURIComponent(filterStr)
  user = user ? `&user=${user}` : ''
  if(ex)
    window.open(`${API.getUri()}/get/pets/export&filter=${filterStr}${user}`, '_blank', 'noopener,noreferrer')
  else{
    const { data } = await API.get(`/get/pets&filter=${filterStr}${user}&page=${page.first}&rows=${page.rows}`)
    return {total: data.total, data: data.data, card: 'pet'};
  }
}