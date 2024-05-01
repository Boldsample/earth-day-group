import Cookies from "js-cookie"

/*
---- USAGE saveJSON ----
Return: Nothing
Params:
- table: Sesion variable (Example: users)
- data: Data to save as object (Example: { name: 'Test', email: 'test@test.com', password: 'test' })
- action (optional): Action to excecute (default: create)
	- create: Add a new register
	- update: Update an existing register
- validation (optional): The variables to validate as object (Example: { id: 1 })
*/
export const saveJSON = async (table, data, action='create', validation={}) => {
	let _data = Cookies.get(table) ? JSON.parse(Cookies.get(table)) : []
	let _id = _data.length + 1
	if(action == 'update'){
		const toValidate = Object.keys(validation)
		const _index = _data.findIndex(item => {
			let _next = true
			toValidate.map(key => {
				if(!_next) return false
				_next = validation[key] == item[key]
				return validation[key] == item[key]
			})
			return _next
		})
		_data[_index] = {..._data[_index], ...data}
	}else{
		_data.push({id: _id, ...data})
		Cookies.set('insertedID', _id)
	}
	Cookies.set(table, JSON.stringify(_data))
}

/*
---- USAGE getJSON ----
Return: Object with finded element of table
Params:
- table: Sesion variable (Example: users)
- validation: The variables to validate as object (Example: { id: 1 })
*/
export const getJSON = (table, validation = {}) => {
	const toValidate = Object.keys(validation)
	const _id = Cookies.get('insertedID')
	let _data = JSON.parse(Cookies.get(table)) || []
	Cookies.remove('insertedID')
	if(toValidate.length){
		let _error
		const _response = _data.find(item => {
			let _next = true
			toValidate.map(key => {
				if(!_next) return false
				_error = key
				_next = validation[key] == item[key]
				return validation[key] == item[key]
			})
			return _next
		})
		if(_response)
		Cookies.set('insertedID', _response.id)
		return _response || {status: '404', data: { message: `El valor de ${_error} no se encuentra en nuestra base de datos.` } }
	}else if(_id)
		return _data.find(item => item.id == _id) || {status: '404', data: { message: 'Ocurrió un error' } }
	return {status: '404', data: { message: 'Ocurrió un error' } }
}

/*
---- USAGE getAllJSON ----
Return: Array with all or filtered element of table
Params:
- table: Sesion variable (Example: users)
- validation (optional): The variables to validate as object (Example: { role: 'user' })
*/
export const getAllJSON = (table, validation = {}) => {
	const toValidate = Object.keys(validation)
	let _data = JSON.parse(Cookies.get(table)) || []
	if(toValidate.length){
		let _error
		const _response = _data.filter(item => {
			let _next = true
			toValidate.map(key => {
				if(!_next) return false
				_error = key
				_next = validation[key] == item[key]
				return validation[key] == item[key]
			})
			return _next
		})
		return _response || {status: '404', data: { message: `El valor de ${_error} no se encuentra en nuestra base de datos.` } }
	}else
		return _data || {status: '404', data: { message: 'Ocurrió un error' } }
}