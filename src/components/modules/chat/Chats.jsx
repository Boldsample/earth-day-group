import { useDispatch, useSelector } from 'react-redux'
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
import { Paginator } from 'primereact/paginator'

const Chats = () => {
  const dispatch = useDispatch()
  const [users, setUsers] = useState([])
  const skeletonPlaceHolder = ["", "", "", ""]
  const [resetFields, setResetFields] = useState(true)
  const user = useSelector(state => state.users.userData)
  const [page, setPage] = useState({first: 0, page: 0, rows: 4})
  const [filters, setFilters] = useState({role: [], keyword: ''})
  const [t] = useTranslation('translation', { keyPrefix: 'chat.chats' })

  const updateFilters = (name, value, wait=false) => {
    setFilters(prev => {
      let setValue = value
      if(name == 'role')
        setValue = prev.role.includes(value) ? prev.role.filter(item => item !== value) : [...prev.role, value]
      return {...prev, [name]: setValue}
    })
    setResetFields(true)
  }
  
  const callUsers = async (ex = false) =>{
    let _filter = { user: `u.id<>'${user?.id}' AND (c.incoming='${user?.id}' OR c.outgoing='${user?.id}') AND u.state=1` }
    if(filters?.role?.length)
      _filter['role'] = `(u.role='${filters?.role?.join("' OR u.role='")}')`
    if(filters?.keyword != '')
      _filter['keyword'] = encodeURIComponent(`(u.name LIKE '%${filters.keyword}%' OR u.email LIKE '%${filters.keyword}%')`)
    const _users = await getUsers(_filter, 'min', user?.id, page)
    setUsers(_users)
  }

  useEffect(() => {
    if(resetFields){
      callUsers()
      setResetFields(false)
    }
  }, [page, resetFields])
  useEffect(() => {
    dispatch(setHeader('user'))
  }, [user])
  
  return <div className="layout">
    <img className="layout__background hide__mobile" src="/assets/user/image-1.svg" />
    <div className="main__content">
      <div className="edg-search mb-0">
        <h1 className="text-defaultCase mb-1">{t('mainTitle')}</h1>
        <div className="mb-1">
          <Button label={t('usersBtnText')} onClick={() => updateFilters('role', 'user')} className={'green-earth small ' + (filters?.role?.find(f => f == 'user') ? '' : 'outline')} />
          <Button label={t('recyclingBtnText')} onClick={() => updateFilters('role', 'company')} className={'green-earth small ' + (filters?.role?.find(f => f == 'company') ? '' : 'outline')} />
          <Button label={t('vendorsBtnText')} onClick={() => updateFilters('role', 'vendor')} className={'green-earth small ' + (filters?.role?.find(f => f == 'vendor') ? '' : 'outline')} />
          <Button label={t('ngoBtnText')} onClick={() => updateFilters('role', 'ngo')} className={'green-earth small ' + (filters?.role?.find(f => f == 'ngo') ? '' : 'outline')} />
        </div>
        <div className="fullwidth p-input-icon-left">
          <FontAwesomeIcon icon={faSearch} />
          <InputText
            placeholder={t('inputSearchPlaceHolder')}
            className="p-inputtext"
            onChange={(e) => updateFilters('keyword', e.target.value)} />
        </div>
      </div>
      {typeof users?.data == 'undefined' && 
        skeletonPlaceHolder.map((skeleton, key) =>  <ChatSkeleton className="" key={key} />)
      || users?.data?.length == 0 && <p className='mt-2'>{t('noChatsMessage')}</p>
      || users?.data?.length > 0 && users?.data?.map(user => 
        <MultiUseCard
          type="user"
          data={user}
          key={user.id} />
      )}
      {page?.rows < users?.total && 
        <Paginator first={page?.first} page={page?.page} rows={page?.rows} totalRecords={users.total} onPageChange={e => setPage({first: e.first, page: e.page, rows: e.rows})} />
      }
    </div>
  </div>
}

export default Chats