import { saveJSON, getAllJSON } from "@utils/useJSON";

export const createOffer = async (data) => {
  const response = saveJSON("offers", data);
  //await API.post("/register", data)
  if (response?.status == 404)
    toast.error(response.status + ": " + response.data.message);
  return true;
};

export const getAllOffers = async (data) => {
	const response = await getAllJSON(data);
	//await API.post("/register", data)
	if (response?.status == 404)
	  toast.error(response.status + ": " + response.data.message);
	return response;
  };
  