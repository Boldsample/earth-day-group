import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { setHeader } from '@store/slices/globalSlice'
import { getNotifications } from '@services/userServices'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'

const Notifications = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.users.userData)
  const [ listNotifications, setListNotifications ] = useState(null)
  const [t] = useTranslation('translation', { keyPrefix: 'notifications.notification' })
  const info = {
    offer: { title: t('offerTitleText'), message: t('offerBodyText') },
    message: { title: t('messageTitleText'), message: t('messageBodyText')},
    report: { title: t('messageTitleText'), message: t('messageBodyText')},
  }
  const callNotifications = async () => {
    const res = await getNotifications({user: user?.id})
    const _res = res.map(notification => {
      const {title, message} = info[notification.type]
      let _notification = {...notification}
      _notification.title = title
      _notification.message = message
      return _notification
    })
    setListNotifications(_res)
  }

  useEffect(() => {
    dispatch(setHeader('user'))
    callNotifications()
  }, [])
  
  return <div className="layout">
    <img className="layout__background" src="/assets/user/image-5.svg" />
    <div className="main__content verticalcenter-1">
      <h1 className='text-defaultCase'>{t('mainTitle')}</h1>
      {listNotifications?.length > 0 && listNotifications.map((notification, key) => 
        <MultiUseCard 
          key={key}
          type='notification'
          data={notification} />
      ) || 
        <p className="mt-3">{t('noNotificationsFoundText')}</p>
      }
    </div>
  </div>
}

export default Notifications