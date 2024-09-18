import { API } from "./API"

export const addProduct = async (data) => {
  const response = await API.post("/add/products", data)
  return response?.data
}

export const updateProduct = async (data, filter) => {
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

export const getProduct = async (id, user = null) => {
  let filterStr = `p.id=${id}`
  user = user ? `&user=${user}` : ''
  const { data } = await API.get(`/get/products&filter=${filterStr}${user}&single=1`)
  return data?.data[0];
}

export const getProducts = async (filter, page, user = null) => {
	let filterStr = ''
  Object.keys(filter).map(f => {
    filterStr += (filterStr ? " AND " : "") + filter[f]
  })
  filterStr = encodeURIComponent(filterStr)
  user = user ? `&user=${user}` : ''
  const { data } = await API.get(`/get/products&filter=${filterStr}${user}&page=${page.page * page.rows}&rows=${page.rows}`)
  return {total: data.total, data: data.data, card: 'product'};
}

export const followProduct = async (senddata) => {
  const {data} = await API.post(`/follow/`, senddata)
  return data.id
}