import axios from "axios"

export const baseURL = "https://api.earthdaygroup.com/php"
export const API = axios.create({
	baseURL: baseURL,
	withXSRFToken: true,
	withCredentials: true,
	headers: {
		Accept: 'application/json'
	}
})