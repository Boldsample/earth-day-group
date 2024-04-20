export const saveJSON = async (field, data, action='create') => {
	let _data = JSON.parse(sessionStorage.getItem(field)) || []
	let _id = _data.length + 1
	if(action == 'update'){
		const _index = _data.findIndex(user => {
			if(user.email == data.email){
				_id = user.id
				return true
			}
			return false
		})
		_data[_index] = {..._data[_index], ...data}
	}else
		_data.push({id: _id, ...data})
	sessionStorage.setItem(field, JSON.stringify(_data))
	sessionStorage.setItem('insertedID', _id)
}

export const getJSON = (field, {email, password} = {}) => {
	console.log(1)
	const _id = sessionStorage.getItem('insertedID')
	console.log(_id)
	let _data = JSON.parse(sessionStorage.getItem(field)) || []
	console.log(_data)
	if(email && password)
		return _data.find(item => item.email == email && item.password == password) || {status: '404', data: { message: 'Ocurrió un error' } }
	else if(_id)
		return _data.find(item => item.id == _id) || {status: '404', data: { message: 'Ocurrió un error' } }
	else
		return {status: '404', data: { message: 'Ocurrió un error' } }
}