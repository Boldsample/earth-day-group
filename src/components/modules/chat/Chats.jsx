import { useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { useEffect, useState } from 'react'
import { InputText } from 'primereact/inputtext'

import { getUsers } from '@services/userServices'
import { setHeader } from '@store/slices/globalSlice'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CardSkeleton from '@ui/skeletons/cardSkeleton/CardSkeleton'
import { useTranslation } from 'react-i18next'
import ChatSkeleton from '@ui/skeletons/chatSkeleton/ChatSkeleton'

const Chats = () => {
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState([])
  const [page, setPage] = useState({page: 0, rows: 8})
  const user = useSelector(state => state.users.userData)
  const skeletonPlaceHolder = ["", "", "", ""]
  const [t] = useTranslation('translation', { keyPrefix: 'chat.chats' })

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
    // setUsers(_users);
    setUsers(undefined);
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
      <div className="edg-search mb-0">
        <h1 className="text-defaultCase mb-1">{t('mainTitle')}</h1>
        <div className="mb-1">
          <Button label={t('usersBtnText')} onClick={() => updateFilter('user')} className={'green-earth small ' + (filters.find(f => f == 'user') ? '' : 'outline')} />
          <Button label={t('recyclingBtnText')} onClick={() => updateFilter('company')} className={'green-earth small ' + (filters.find(f => f == 'company') ? '' : 'outline')} />
          <Button label={t('vendorsBtnText')} onClick={() => updateFilter('vendor')} className={'green-earth small ' + (filters.find(f => f == 'vendor') ? '' : 'outline')} />
          <Button label={t('ngoBtnText')} onClick={() => updateFilter('ngo')} className={'green-earth small ' + (filters.find(f => f == 'ngo') ? '' : 'outline')} />
        </div>
        <div className="fullwidth p-input-icon-left">
          <FontAwesomeIcon icon={faSearch} />
          <InputText
            placeholder={t('inputSearchPlaceHolder')}
            className="p-inputtext"
            onChange={(e) => updateFilter(e.target.value)} />
        </div>
      </div>
      {/* <CardSkeleton className="chatCard__skeleton" /> */}
          {typeof users?.data == 'undefined' && 
                skeletonPlaceHolder.map((skeleton, key) =>  <ChatSkeleton className="" key={key} />)
              || users?.data?.length > 0 && users?.data?.map(user => 
                <MultiUseCard
                  type="user"
                  data={user}
                  key={user.id} />
              )}
            
      {/* {users?.data?.length > 0 && users?.data?.map(user => 
        <MultiUseCard
          type="user"
          data={user}
          key={user.id} />
      )} */}
    </div>
  </div>
}

export default Chats