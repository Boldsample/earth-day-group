import { useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { useEffect, useState } from 'react'
import { InputText } from 'primereact/inputtext'

import { getUsers } from '@services/userServices'
import { setHeader } from '@store/slices/globalSlice'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import ProfileInfo from '@modules/settings/profile/ProfileInfo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Chats = () => {
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState([])
  const [profile, setProfile] = useState({})
  const user = useSelector(state => state.users.userData)

  const hidePopup = () => setProfile({...profile.data, show: false})
  const updateFilter = filter => {
    setFilters(prev => {
      if(prev.includes(filter))
        return prev.filter(item => item !== filter);
      else
        return [...prev, filter];
    })
  }
  const getUserList = async () => {
    let _filters = !filters?.length ? "" : "AND (role='" + filters.join("' OR role='") + "')"
    const _users = await getUsers(`u.id<>'${user?.id}' ${_filters}`, 'min', user?.id)
    setUsers(_users)
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
        </div>
        <div className="fullwidth p-input-icon-left">
          <FontAwesomeIcon icon={faSearch} />
          <InputText
            placeholder="Search"
            className="p-inputtext"
            onChange={(e) => updateFilter(e.target.value)} />
        </div>
      </div>
      <Dialog visible={profile?.show} onHide={hidePopup}>
        <div className="profile-content">
          <ProfileInfo user={profile.data} type="show" />
        </div>
      </Dialog>
      {users?.length > 0 && users?.map(user => 
        <MultiUseCard
          type="user"
          data={user}
          key={user.id}
          action={setProfile} />
      )}
    </div>
  </div>
}

export default Chats