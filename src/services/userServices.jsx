import axios from "axios"
import { toast } from 'react-toastify'

import { API } from "./API"
import { saveJSON, getJSON } from "@utils/useJSON"

export const getUserGoogle = async (token) => {
	const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json'
		}
	})
	return res.data
}
export const authUser = async (data) => {
	const response = getJSON('users', data)
	//const response = await API.post("/login", data)
	if(response?.status == 404)
		toast.error(response.status+': '+response.data.message)
	return response?.id
}
export const createUser = async (data) => {
	const response = saveJSON('users', data)
	//await API.post("/register", data)
	if(response?.status == 404)
		toast.error(response.status+': '+response.data.message)
	return true
}
export const logoutUser = async () => {
	//await API.post("/logout")
	return true
}
export const recoverUser = async (data, validate) => {
	const response = saveJSON('users', data, 'update', validate)
	//await API.post("/register", data)
	if(response?.status == 404)
		toast.error(response.status+': '+response.data.message)
	return true
}
export const getUser = async () => {
	const data = await getJSON('users')
	//const { data } = await API.get(`/api/user/`)
	return data
}
export const getUsers = async () => {
	const data = await getAllJSON('users')
	//const res = await API.get("/users")
	return res.data;
}
// export const getUser = async (name) => {
//   const url = `https://api.github.com/users/${name}`;
//   const res = await fetch(url);
//   const data = await res.json();
//   return data;
// };