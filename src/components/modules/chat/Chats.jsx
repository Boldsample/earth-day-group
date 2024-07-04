import { useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { useEffect, useState } from 'react'
import { InputText } from 'primereact/inputtext'

import { getUsers } from '@services/userServices'
import { setHeader } from '@store/slices/globalSlice'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Chats = () => {
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState([])
  const [page, setPage] = useState({page: 0, rows: 8})
  const user = useSelector(state => state.users.userData)

  const updateFilter = filter => {
    setFilters(prev => {
      if(prev.includes(filter))
        return prev.filter(item => item !== filter);
      else
        return [...prev, filter];
    })
  }
  const getUserList = async () => {
    let _filter = { user: `u.id<>'${user?.id}' AND (c.incoming='${user?.id}' OR c.outgoing='${user?.id}')` }
    if(filters?.length > 0)
      _filter['role'] = "(role='" + filters.join("' OR role='") + "')"
    const _users = await getUsers(_filter, 'min', user?.id, page)
    setUsers(_users);
  }

  useEffect(() => {
    getUserList()
  }, [filters])
	useEffect(() => {
    setHeader('user')
  }, [user])
  
  return <div className="layout">
    <img className="layout__background" src="/assets/user/image-1.svg" />
    <div className="main__content">
      <div className="search mb-0">
        <h1 className="text-defaultCase mb-1">Chat</h1>
        <div className="mb-1">
          <Button label="Users" onClick={() => updateFilter('user')} className={'green-earth small ' + (filters.find(f => f == 'user') ? '' : 'outline')} />
          <Button label="Recycling Centers" onClick={() => updateFilter('company')} className={'green-earth small ' + (filters.find(f => f == 'company') ? '' : 'outline')} />
          <Button label="Vendors" onClick={() => updateFilter('vendor')} className={'green-earth small ' + (filters.find(f => f == 'vendor') ? '' : 'outline')} />
          <Button label="NGO" onClick={() => updateFilter('ngo')} className={'green-earth small ' + (filters.find(f => f == 'ngo') ? '' : 'outline')} />
        </div>
        <div className="fullwidth p-input-icon-left">
          <FontAwesomeIcon icon={faSearch} />
          <InputText
            placeholder="Search"
            className="p-inputtext"
            onChange={(e) => updateFilter(e.target.value)} />
        </div>
      </div>
      {users?.data?.length > 0 && users?.data?.map(user => 
        <MultiUseCard
          type="user"
          data={user}
          key={user.id} />
      )}
    </div>
  </div>
}

export default Chats