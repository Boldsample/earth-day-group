import { useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

import { getUsers } from '@services/userServices'
import { setHeader } from '@store/slices/globalSlice'
import { ProfileProvider } from '@components/modules'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import ChatSkeleton from '@ui/skeletons/chatSkeleton/ChatSkeleton'
import { Paginator } from 'primereact/paginator'

const Followers = ({followers = true}) => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState([])
  const skeletonPlaceHolder = ["", "", "", ""]
  const [profile, setProfile] = useState(null)
  const [page, setPage] = useState({first: 0, page: 0, rows: 4})
  const user = useSelector(state => state.users.userData)
  const [t] = useTranslation('translation', { keyPrefix: 'followers' })

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
    let _filter = {
      user: `u.id<>'${user?.id}'`,
      type: followers ? `f.user='${user?.id}'` : `f.follower='${user?.id}'`
    }
    const _users = await getUsers(_filter, type, null, page)
    setUsers(_users);
  }

  useEffect(() => {
    getUserList()
    setHeader('user')
  }, [filters, followers])
  
  return <div className="layout">
    <img className="layout__background" src="/assets/user/image-1.svg" />
    <div className="main__content">
      <div className="edg-search mb-0">
        <h1 className="text-defaultCase mb-1">{followers ? t('followersMainTitle') : t('followingMainTitle')}</h1>
        {/* <div className="mb-1">
          <Button label={t('followersMainTitle')} onClick={() => navigate('/followers/')} className={'green-earth small ' + (followers ? '' : 'outline')} />
          <Button label={t('followingMainTitle')} onClick={() => navigate('/following/')} className={'green-earth small ' + (!followers ? '' : 'outline')} />
        </div> */}
        <div className="fullwidth p-input-icon-left">
          <FontAwesomeIcon icon={faSearch} />
          <InputText
            placeholder={t('inputSearchPlaceHolder')}
            className="p-inputtext"
            onChange={(e) => updateFilter(e.target.value)} />
        </div>
      </div>
      <ProfileProvider profile={profile} setProfile={setProfile} reloadList={getUserList}>
        <>
          {typeof users?.data == 'undefined' && 
            skeletonPlaceHolder.map((skeleton, key) =>  <ChatSkeleton className="" key={key} />)
          || users?.data?.length > 0 && users?.data?.map(user => 
            <MultiUseCard
              type="user"
              data={user}
              key={user.id}
              action={setProfile} />
          )}
          {page?.rows < users?.total && 
            <Paginator first={page?.first} page={page?.page} rows={page?.rows} totalRecords={users.total} onPageChange={e => setPage({first: e.first, page: e.page, rows: e.rows})} />
          }
        </>
      </ProfileProvider>
    </div>
  </div>
}

export default Followers