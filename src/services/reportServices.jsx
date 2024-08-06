import { API } from "./API"

export const getEntity = async (type, id) => {
  let table, filter
  switch (type) {
    case 'user':
      table = 'users'
      filter = `u.username='${id}'`
      break;
    case 'offer':
      table = 'offers'
      filter = `o.id=${id}`
      break;
    case 'product':
      table = 'products'
      filter = `p.id=${id}`
      break;
    case 'pet':
      table = 'pets'
      filter = `p.id=${id}`
      break;
  }
  const filterStr = encodeURIComponent(filter)
  const { data } = await API.get(`/get/${table}&filter=${filterStr}`)
  return data?.data;
}

export const addReport = async (data) => {
  const response = await API.post("/add/reports", data)
  return response?.data
}

export const addImages = async (data) => {
  const response = await API.post("/add_multiple/images", data)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message)
  return true
}

export const updateReport = async (data, filter) => {
  let filterStr = ''
  Object.keys(filter).map(f => {
    filterStr += (filterStr ? " AND " : "") + f + "='" + filter[f] + "'"
  })
  filterStr = encodeURIComponent(filterStr)
  const response = await API.post(`/update/reports&filter=${filterStr}`, data)
  return {id: filter.id}
}

export const getReport = async id => {
  const filterStr = encodeURIComponent(`r.id=${id}`)
  const { data } = await API.get(`/get/reports&filter=${filterStr}&single=1`)
  return data?.data[0];
}

export const getReports = async (filter, page) => {
	let filterStr = ''
  Object.keys(filter).map(f => {
    filterStr += (filterStr ? " AND " : "") + filter[f]
  })
  filterStr = encodeURIComponent(filterStr)
  const { data } = await API.get(`/get/reports&filter=${filterStr}&page=${page.page}&rows=${page.rows}`)
  return {total: data.total, data: data.data, card: 'report'};
}