import { useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { InputText } from 'primereact/inputtext'

import { getUsers } from '@services/userServices'
import { setHeader } from '@store/slices/globalSlice'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Followers = ({followers = true}) => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState([])
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
    const type = followers ? 'followers' : 'following'
    const filter = followers ? ` AND f.user='${user?.id}'` : ` AND f.follower='${user?.id}'`
    const _users = await getUsers(`u.id<>'${user?.id}'${filter}`, type) 
    setUsers(_users)
  }

  useEffect(() => {
    getUserList()
    setHeader('user')
  }, [filters, followers])
  
  return <div className="layout">
    <img className="layout__background" src="/assets/user/image-1.svg" />
    <div className="main__content">
      <div className="search mb-0">
        <h1 className="text-defaultCase mb-1">Followers</h1>
        <div className="mb-1">
          <Button label="Followers" onClick={() => navigate('/followers/')} className={'green-earth small ' + (followers ? '' : 'outline')} />
          <Button label="Following" onClick={() => navigate('/following/')} className={'green-earth small ' + (!followers ? '' : 'outline')} />
        </div>
        <div className="fullwidth p-input-icon-left">
          <FontAwesomeIcon icon={faSearch} />
          <InputText
            placeholder="Search"
            className="p-inputtext"
            onChange={(e) => updateFilter(e.target.value)} />
        </div>
      </div>
      {users?.length > 0 && users?.map(user => 
        <MultiUseCard
          type="user"
          data={user}
          key={user.id} />
      )}
    </div>
  </div>
}

export default Followers