import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Link } from 'react-router-dom'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { callNotifications } from '@store/slices/usersSlice'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './styles.sass'

const HeaderNotifications = () => {
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.users.userData.id)
  const notifications = useSelector((state) => state.users.notifications)

  useEffect(() => {
    if(userId){
      const _last = notifications.length ? notifications[0].date : 0
      dispatch(callNotifications({user: userId, date: _last}))
    }
  }, [userId, notifications])
  
  return <div className="header_notifications">
    <Link to={"/notifications/"}><FontAwesomeIcon icon={faBell} /></Link>
    <div className="list">
      {notifications?.length && notifications.map(notification => 
        <MultiUseCard 
          type='notification'
          data={notification} />
      )}
    </div>
  </div>
}

export default HeaderNotifications