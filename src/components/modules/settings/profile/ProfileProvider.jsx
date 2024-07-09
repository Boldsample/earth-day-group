import { Dialog } from "primereact/dialog"
import { useEffect, useState } from "react"

import ProfileInfo from "./ProfileInfo"
import { getUser } from "@services/userServices"
import { useDispatch, useSelector } from "react-redux"
import { followUserData } from "@store/slices/usersSlice"

const ProfileProvider = ({profile, reloadList = () => false, children}) => {
  const dispatch = useDispatch()
  const [ user, setUser ] = useState({})
  const [ show, setShow ] = useState(false)
  const userData = useSelector((state) => state.users.userData)

  const hidePopup = () => setShow(false)
  const doFollow = () => dispatch(followUserData({user: user.id, follower: userData?.id}))
  const loadUser = async (force = false) => {
    if(force || user.id !== profile?.id){
      const _response = await getUser(profile?.id, userData?.id)
      setUser({..._response})
    }
    if(profile)
      setShow(true)
  }

  useEffect(() => {
    reloadList()
    loadUser(true)
  }, [user])
  useEffect(() => {
    loadUser()
  }, [profile])
  
  return <>
    <Dialog className="profile-content" visible={show} onHide={hidePopup} draggable={false} style={{width: '600px'}} breakpoints={{'700px': 'calc(100% - 40px)'}}>
      <ProfileInfo type={profile?.type} user={user} doFollow={doFollow} same={user.id === userData?.id} />
    </Dialog>
    {children}
  </>
}

export default ProfileProvider