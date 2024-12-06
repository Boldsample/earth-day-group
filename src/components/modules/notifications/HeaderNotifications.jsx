import { Link } from 'react-router-dom'
import { Badge } from 'primereact/badge'
import { useSelector } from 'react-redux'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip } from 'primereact/tooltip'
import { useTranslation } from "react-i18next"
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'

import './styles.sass'

const HeaderNotifications = () => {
  const [tToolTip] = useTranslation('translation', { keyPrefix: 'tooltips' })
  const notifications = useSelector((state) => state.users.notifications)
  return <div className={`header_notifications`}>
    <Link className="p-overlay-badge" to={"/notifications/"}>
      {notifications?.length > 0 && 
        <Badge severity="danger" value={notifications?.length}></Badge>
      }
      <Tooltip target=".notifications" showDelay={700}/>
      <FontAwesomeIcon className=' notifications' data-pr-tooltip={tToolTip("notifications")} data-pr-position="bottom" icon={faBell} />
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