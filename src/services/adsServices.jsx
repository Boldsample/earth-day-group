import { API } from "./API"

export const addAd = async (data) => {
    data.target = data.target.join(", ")
    const response = await API.post("/add/ads", data)
    return response?.data
  }

  export const updateAd = async (data, filter) => {
    let filterStr = ''
    Object.keys(filter).map(f => {
      filterStr += (filterStr ? " AND " : "") + f + "='" + filter[f] + "'"
    })
    filterStr = encodeURIComponent(filterStr)
    const response = await API.post(`/update/ads&filter=${filterStr}`, data)
    return {id: filter.id}
  }
  
  export const addImages = async (data) => {
    const response = await API.post("/add_multiple/images", data)
    if (response?.status == 404)
      toast.error(response.status + ": " + response.data.message)
    return true
  }
  
  export const getAd = async (type) => {
    let filterStr = `a.type='${type}' AND a.state = 1`
    const { data } = await API.get(`/get/ads&filter=${filterStr}&single=1`)
    return data?.data[0];
  }