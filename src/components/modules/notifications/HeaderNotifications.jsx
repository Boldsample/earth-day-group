import { Link } from 'react-router-dom'
import { Badge } from 'primereact/badge'
import { useSelector } from 'react-redux'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'

import './styles.sass'

const HeaderNotifications = () => {
  const notifications = useSelector((state) => state.users.notifications)
  
  return <div className="header_notifications">
    <Link className="p-overlay-badge" to={"/notifications/"}>
      {notifications?.length > 0 && 
        <Badge severity="danger" value={notifications?.length}></Badge>
      }
      <FontAwesomeIcon icon={faBell} />
    </Link>
    <div className="list">
      {notifications?.length > 0 && notifications.map((notification, key) => 
        <MultiUseCard 
          key={key}
          type='notification'
          data={notification} />
      ) || null}
    </div>
  </div>
}

export default HeaderNotifications