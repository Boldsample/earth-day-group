import { Dialog } from "primereact/dialog"
import { useEffect, useState } from "react"

import ProfileInfo from "./ProfileInfo"
import { useSelector } from "react-redux"
import { useNotifications } from '@components/WebSocket'
import { followUser, getUser } from "@services/userServices"

const ProfileProvider = ({profile, reloadList = () => false, children}) => {
  const [ user, setUser ] = useState({})
  const [ show, setShow ] = useState(false)
  const { sendNotificationMessage } = useNotifications()
  const userData = useSelector((state) => state.users.userData)

  const hidePopup = () => setShow(false)
  const doFollow = async () => {
    await followUser({user: user.id, follower: userData?.id}, sendNotificationMessage)
    loadUser(true)
  }
  const loadUser = async (force = false) => {
    if(force || user.id !== profile?.id){
      const _response = await getUser(profile?.id, userData?.id)
      setUser({..._response})
      reloadList()
      //loadUser(true)
    }
    if(profile)
      setShow(true)
  }

  useEffect(() => {
    loadUser()
  }, [profile])
  
  return <>
    <Dialog className="profile-content" visible={show} onHide={hidePopup} draggable={false} style={{width: '38rem'}}>
      <ProfileInfo type={profile?.type} user={user} doFollow={doFollow} same={user.id === userData?.id} admin={userData.role == 'admin'} />
    </Dialog>
    {children}
  </>
}

export default ProfileProvider