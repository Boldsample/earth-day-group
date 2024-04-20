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
	try {
		const _user = getJSON('users', data)
		sessionStorage.setItem('insertedID', _user.id)
		//await API.post("/login", data)
		return true
	} catch (e) {
		toast.error(e.response?.status+': '+e.response?.data.message)
		return false
	}
}
export const createUser = async (data) => {
	try {
		await saveJSON('users', data)
		//await API.post("/register", data)
		return true
	} catch (e) {
		toast.error(e.response?.status+': '+e.response?.data.message)
		return false
	}
}
export const logoutUser = async () => {
	try {
		//await API.post("/logout")
		return true
	} catch (e) {
		toast.error(e.response.status+': '+e.response.data.message)
		return false
	}
}
export const recoverUser = async (data) => {
	try {
		await saveJSON('users', data, 'update')
		//await API.post("/logout")
		return true
	} catch (e) {
		toast.error(e.response.status+': '+e.response.data.message)
		return false
	}
}
export const getUser = async () => {
	const { data } = await API.get(`/api/user/`)
	return data
}
export const getUsers = async () => {
	const res = await API.get("/users");
	return res.data;
}
// export const getUser = async (name) => {
//   const url = `https://api.github.com/users/${name}`;
//   const res = await fetch(url);
//   const data = await res.json();
//   return data;
// };