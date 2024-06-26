import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ProfileInfo from './ProfileInfo'
import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

const ProfileSettings = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.users.userData)

  useEffect(() => {
    dispatch(setHeader('settings'))
    dispatch(setHeaderTitle('Profile'))
  }, [])

  return <div className="layout" style={{background: 'white'}}>
    <div className="main__content centerwidth alignttop text-center">
      <ProfileInfo user={user} />
    </div>
  </div>
}

export default ProfileSettings