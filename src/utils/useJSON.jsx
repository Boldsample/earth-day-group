export const saveJSON = (field, data) => {
	let _data = JSON.parse(sessionStorage.getItem(field)) || []
	const _id = _data.length + 1
	_data.push({id: _id, ...data})
	sessionStorage.setItem(field, JSON.stringify(_data))
	sessionStorage.setItem('insertedID', _id)
}

export const getJSON = (field, {email, password} = {}) => {
	const _id = sessionStorage.getItem('insertedID')
	let _data = JSON.parse(sessionStorage.getItem(field)) || []
	if(email && password)
		return _data.find(item => item.email == email && item.password == password) || {status: '404', data: { message: 'Ocurrió un error' } }
	else if(_id)
		return _data.find(item => item.id == _id) || {status: '404', data: { message: 'Ocurrió un error' } }
	else
		return {status: '404', data: { message: 'Ocurrió un error' } }
}