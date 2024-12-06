import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { setHeader } from '@store/slices/globalSlice'
import { getNotifications } from '@services/userServices'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import ChatSkeleton from '@ui/skeletons/chatSkeleton/ChatSkeleton'
import { Paginator } from 'primereact/paginator'

const Notifications = () => {
  const dispatch = useDispatch()
  const skeletonPlaceHolder = ["", "", "", ""]
  const user = useSelector((state) => state.users.userData)
  const [page, setPage] = useState({first: 0, page: 0, rows: 4})
  const [ listNotifications, setListNotifications ] = useState(null)
  const [t] = useTranslation('translation', { keyPrefix: 'notifications.notification' })
  const info = {
    offer: { title: t('offerTitleText'), message: t('offerBodyText') },
    message: { title: t('messageTitleText'), message: t('messageBodyText')},
    report: { title: t('messageTitleText'), message: t('messageBodyText')},
  }
  const callNotifications = async () => {
    const res = await getNotifications({user: user?.id}, page)
    const _res = res?.data?.map(notification => {
      const {title, message} = info[notification.type]
      let _notification = {...notification}
      _notification.title = title
      _notification.message = message
      return _notification
    })
    setListNotifications({...res, data: _res})
  }

  useEffect(() => {
    dispatch(setHeader('user'))
    callNotifications()
  }, [page])
  
  return <div className="layout">
    <img className="layout__background" src="/assets/user/image-5.svg" />
    <div className="main__content verticalcenter-1">
      <h1 className='text-defaultCase'>{t('mainTitle')}</h1>
      {typeof listNotifications?.data == 'undefined' && 
        skeletonPlaceHolder.map((skeleton, key) =>  <ChatSkeleton className="" key={key} />)
      || listNotifications?.data?.length > 0 && listNotifications?.data?.map(notification => 
        <MultiUseCard
          data={notification}
          type="notification"
          key={notification.id} />
      )}
      {page?.rows < listNotifications?.total && 
        <Paginator first={page?.first} page={page?.page} rows={page?.rows} totalRecords={listNotifications.total} onPageChange={e => setPage({first: e.first, page: e.page, rows: e.rows})} />
      }
    </div>
  </div>
}

export default Notifications