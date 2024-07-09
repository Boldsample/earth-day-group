import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import {  getUser } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import ProfileListing from "@ui/templates/ProfileListing/ProfileListing"

import "./profile.sass"

const Profile = ({type = 'products'}) => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [ profile, setProfile ] = useState(null)
  const user = useSelector((state) => state.users.userData)
  
  const loadProfile = async () => {
    const _profile = await getUser(id, user?.id)
    setProfile(_profile)
  }
  
  useEffect(() => {
    if(profile == null && id)
      loadProfile()
    else if(profile == null)
      setProfile(user)
		dispatch(setHeader('user'))
  }, [])

  return <ProfileListing type={profile?.role == 'shelter' ? 'pet' : type} profile={profile} reloadElements={loadProfile} />
}

export default Profile