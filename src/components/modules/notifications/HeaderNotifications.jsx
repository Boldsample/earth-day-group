import { Link } from 'react-router-dom'
import { Badge } from 'primereact/badge'
import { useSelector } from 'react-redux'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip } from 'primereact/tooltip'
import { useTranslation } from "react-i18next"
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'

import './styles.sass'
import { Dialog } from 'primereact/dialog'
import { updateMessage } from '@services/chatServices'
import { useNotifications } from '@components/WebSocket'

const HeaderNotifications = () => {
  const { sendNotificationMessage } = useNotifications()
  const userId = useSelector((state) => state.users.userData.id)
  const notifications = useSelector((state) => state.users.notifications)
  const [tToolTip] = useTranslation('translation', { keyPrefix: 'tooltips' })
  const [t] = useTranslation('translation', { keyPrefix: 'register.registerCompany.companyStandardForm' })

  const onHide = async (selected) => {
    await updateMessage({readed: 1}, {id: selected})
    sendNotificationMessage(userId, 'Report confirmation')
  }

  return <div className={`header_notifications hide__mobile`}>

    <Link className="p-overlay-badge" to={"/notifications/"}>
      {notifications?.length > 0 && 
        <Badge severity="danger" value={notifications?.length}></Badge>
      }
      <Tooltip target=".notifications" />
      <FontAwesomeIcon className=' notifications' data-pr-tooltip={tToolTip("notifications")} data-pr-position="top" icon={faBell} />
    </Link>
    <div className="list">
      {notifications?.length > 0 && notifications.map((notification, key) => 
        {
          console.log(notification)
          if(notification?.type != 'report')
            return <MultiUseCard 
              key={key}
              type='notification'
              data={notification} />
          else
            return <Dialog key={key} className="reports" visible={true} onHide={() => onHide(notification?.id)} draggable={false} >
              <div className="main__content centerwidth verticalcenter-2 text-center">
                <div className="inline-block" style={{width: '31.25rem'}}>
                  <h2 className="text-upperCase mb-2">{tToolTip(notification?.message)}</h2>
                  <p className="mb-2">{tToolTip("reportedDetail")}</p>
                  <p><button className="dark-blue fullwidth" onClick={() => onHide(notification?.id)}>{t("continueBtnText")}</button></p>
                </div>
              </div>
            </Dialog>
        }
      ) || null}
    </div>
  </div>
}

export default HeaderNotifications