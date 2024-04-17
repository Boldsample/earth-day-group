/*		userServices	*/
export const authUser = async (data) => {
	try {
		await API.post("/login", data)
		return true
	} catch (e) {
		toast.error(e.response?.status+': '+e.response?.data.message)
		return false
	}
}
export const createUser = async (data) => {
	try {
		await API.post("/register", data)
		return true
	} catch (e) {
		toast.error(e.response?.status+': '+e.response?.data.message)
		return false
	}
}
export const logoutUser = async () => {
	try {
		await API.post("/logout")
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