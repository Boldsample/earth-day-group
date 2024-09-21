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
    let filterStr = `a.type='${type}'`
    filterStr = encodeURIComponent(filterStr)
    const { data } = await API.get(`/get/ads&filter=${filterStr}&single=1`)
    let returningData = {...data.data[0]}
    const startDate = new Date(returningData?.start_date);
      const endDate = new Date(returningData?.end_date);
      
      const currentTime = new Date();
      const timeDiffInMilliseconds =  endDate - currentTime ;
      
      if (returningData.state == 1 && timeDiffInMilliseconds <= 0) {
        console.log(returningData.id)
        await updateAd({state:2}, {id: returningData.id})
       

        returningData.state = 2
      }

    return returningData;
  }