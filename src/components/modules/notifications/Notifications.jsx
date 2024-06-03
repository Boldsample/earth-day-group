import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setHeader } from '@store/slices/globalSlice'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'

const Notifications = () => {
  const dispatch = useDispatch()
    const notifications = useSelector((state) => state.users.notifications)

  useEffect(() => {
    dispatch(setHeader('user'))
  }, [])
  
  return <div className="layout">
    <img className="layout__background" src="/assets/user/image-5.svg" />
    <div className="main__content">
      <h1 className='text-defaultCase'>Notifications</h1>
      {notifications?.length && notifications.map((notification, key) => 
        <MultiUseCard 
          key={key}
          type='notification'
          data={notification} />
      ) || null}
    </div>
  </div>
}

export default Notifications