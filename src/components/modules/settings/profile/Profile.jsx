import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ProfileInfo from './ProfileInfo'
import { getUserData } from '@store/slices/usersSlice'
import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

const ProfileSettings = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.users.userData)

  useEffect(() => {
    dispatch(setHeader('settings'))
    dispatch(getUserData(user?.id))
    dispatch(setHeaderTitle('profileBtnText'))
  }, [])

  return <div className="layout" style={{background: 'white'}}>
    <div className="main__content centerwidth alignttop text-center">
      <ProfileInfo type="settings" user={user} same={true} admin={user.role == 'admin'} />
    </div>
  </div>
}

export default ProfileSettings