import { Dialog } from "primereact/dialog"
import { useEffect, useState } from "react"

import ProfileInfo from "./ProfileInfo"
import { useSelector } from "react-redux"
import { followUser, getUser } from "@services/userServices"

const ProfileProvider = ({profile, reloadList = () => false, children}) => {
  const [ user, setUser ] = useState({})
  const [ show, setShow ] = useState(false)
  const userId = useSelector((state) => state.users.userData.id)

  const hidePopup = () => setShow(false)
  const doFollow = async () => {
    await followUser({user: user.id, follower: userId})
    reloadList()
    loadUser(true)
  }
  const loadUser = async (force = false) => {
    if(force || user.id !== profile?.id){
      const _response = await getUser(profile?.id, userId)
      setUser({..._response})
    }
    if(profile)
      setShow(true)
  }

  useEffect(() => {
    loadUser()
  }, [profile])
  
  return <>
    <Dialog className="profile-content" visible={show} onHide={hidePopup} draggable={false} style={{width: '600px'}} breakpoints={{'700px': 'calc(100% - 40px)'}}>
      <ProfileInfo type={profile?.type} user={user} doFollow={doFollow} same={user.id === userId} />
    </Dialog>
    {children}
  </>
}

export default ProfileProvider