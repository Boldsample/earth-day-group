import { API } from "./API"
import { saveJSON, getAllJSON } from "@utils/useJSON"

export const createOffer = async (data) => {
  //const response = saveJSON("offers", data);
  const response = await API.post("/add/offers", [data])
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message)
  return true;
};

export const getOffers = async (filter) => {
	//const response = await getAllJSON(data);
	let filterStr = ''
  if(typeof filter == 'string')
    filterStr = filter
  else
    Object.keys(filter).map(f => {
      filterStr += (filterStr ? " AND " : "") + f + "='" + filter[f] + "'"
    })
  filterStr = encodeURIComponent(filterStr)
  const response = await API.get(`/get/offers&filter=${filterStr}`)
	if (response?.status == 404)
	  toast.error(response.status + ": " + response.data.message)
  return response?.data?.data;
};