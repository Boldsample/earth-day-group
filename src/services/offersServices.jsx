import { API } from "./API"

export const createOffer = async (data) => {
  const response = await API.post("/add/offers", data)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message)
  return response?.data?.id
};

export const updateOffer = async (offer, proposal, reject, chat) => {
  if(reject){
    let filterStr = `id=${proposal}`
    filterStr = encodeURIComponent(filterStr)
    await API.post(`/update/chat&filter=${filterStr}`, { rejected: 1 })
  }else{
    let filterStr = `id=${offer}`
    filterStr = encodeURIComponent(filterStr)
    await API.post(`/update/offers&filter=${filterStr}`, { status: proposal })
    await API.post("/add/chat", { type: 'confirmation', offer, incoming: chat?.incoming, outgoing: chat?.outgoing })
  }
  return true
}

export const addImages = async (data) => {
  const response = await API.post("/add_multiple/images", data)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message)
  return true
}

export const getOffer = async (id) => {
  let filterStr = `o.id=${id}`
  filterStr = encodeURIComponent(filterStr)
  const { data } = await API.get(`/get/offers&filter=${filterStr}`)
  const response = data?.data?.map(offer => {
    let _offer = {...offer}
    _offer.offers = _offer.offers ? JSON.parse(_offer.offers) : null
    _offer.pictures = _offer.pictures ? JSON.parse(_offer.pictures) : null
    return _offer
  })
  return response[0];
};

export const getOffers = async (filter, page) => {
	let filterStr = ''
  Object.keys(filter).map(f => {
    if(f == 'materials')
      filterStr += (filterStr ? " AND " : "") + filter[f]
    else 
      filterStr += (filterStr ? " AND " : "") + f + "='" + filter[f] + "'"
  })
  filterStr = encodeURIComponent(filterStr)
  const { data } = await API.get(`/get/offers&filter=${filterStr}&page=${page.page * page.rows}&rows=${page.rows}`)
  const response = data.data.map(offer => {
    let _offer = {...offer}
    _offer.offers = _offer.offers ? JSON.parse(_offer.offers) : null
    _offer.pictures = _offer.pictures ? JSON.parse(_offer.pictures) : null
    return _offer
  })
  return {total: data.total, data: response};
};