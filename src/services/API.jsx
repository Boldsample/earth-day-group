import axios from "axios"

export const API = axios.create({
	withXSRFToken: true,
	withCredentials: true,
	baseURL: "https://earth-day-group.boldsample.com/php",
	headers: {
		Accept: 'application/json'
	}
})