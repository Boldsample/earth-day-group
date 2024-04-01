import axios from "axios"

export const API = axios.create({
	withXSRFToken: true,
	withCredentials: true,
	baseURL: "http://localhost:8000",
	headers: {
		Accept: 'application/json'
	}
})
//export const csrf = () => API.get("/sanctum/csrf-cookie")