import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getUsersList } from '@store/slices/usersSlice'
import { setHeader, updateAddLink } from '@store/slices/globalSlice'
import { Button } from 'primereact/button'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { InputText } from 'primereact/inputtext'

const Chats = () => {
  const dispatch = useDispatch()
  const [filters, setFilters] = useState([])
  const users = useSelector(state => state.users.usersList)
  const user = useSelector(state => state.users.userData)

  const updateFilter = filter => {
    setFilters(prev => {
      if(prev.includes(filter))
        return prev.filter(item => item !== filter);
      else
        return [...prev, filter];
    })
  }

  useEffect(() => {
    console.log(filters)
    let _filters = !filters?.length ? "" : "AND (role='" + filters.join("' OR role='") + "')"
    console.log(_filters)
    dispatch(getUsersList(`id<>'${user?.id}' ${_filters}`))
  }, [filters])
	useEffect(() => {
    setHeader('user')
  }, [user])
  
  return <div className="layout">
    <img className="layout__background" src="/assets/user/image-1.svg" />
    <div className="main__content halfspace halfwidth alignttop">
      <div className="search mb-0">
        <h1 className="text-defaultCase">Chat</h1>
        <div className="mb-1">
          <p className="mt-1">Filters:</p>
          <Button label="Users" onClick={() => updateFilter('user')} className={'green-earth small ' + (filters.find(f => f == 'user') ? '' : 'outline')} />
          <Button label="Recycling Centers" onClick={() => updateFilter('company')} className={'green-earth small ' + (filters.find(f => f == 'company') ? '' : 'outline')} />
          <Button label="Vendors" onClick={() => updateFilter('vendor')} className={'green-earth small ' + (filters.find(f => f == 'vendor') ? '' : 'outline')} />
        </div>
        <div className="fullwidth p-input-icon-left">
          <FontAwesomeIcon icon={faSearch} />
          <InputText
            placeholder="Search"
            className="p-inputtext"
            onChange={(e) => updateFilter(e.target.value)} />
        </div>
      </div>
      {users?.length && users?.map(user => 
        <MultiUseCard
          type="user"
          data={user}
          key={user.id} />
      )}
    </div>
  </div>
}

export default Chats