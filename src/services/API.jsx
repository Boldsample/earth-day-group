import axios from "axios"

export const API = axios.create({
	withXSRFToken: true,
	withCredentials: true,
	baseURL: "http://earth-day-group.boldsample.com/api",
	headers: {
		Accept: 'application/json'
	}
})
//export const csrf = () => API.get("/sanctum/csrf-cookie")