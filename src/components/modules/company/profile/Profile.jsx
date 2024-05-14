import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Footer from "@ui/footer/Footer"
import PhotoGallery from "./PhotoGallery"
import { getUser } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import CompanyInformation from "./CompanyInformation"

import "./profile.sass"

const Profile = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [ profile, setProfile ] = useState(null)
  const user = useSelector((state) => state.users.userData)
  
  const getProfileData = async () => {
    const _profile = await getUser(id)
    setProfile(_profile)
  }

  useEffect(() => {
    if(id)
      getProfileData()
    else
      setProfile(user)
		dispatch(setHeader('user'))
  }, [])

  return profile && <div className="layout">
    {/*<img className="layout__background" src="/assets/register/image-2.svg" />*/}
    <div className="profile__layout">
      <CompanyInformation company={profile} canEdit={!id} />
      <PhotoGallery imageCatalog={profile?.images} />
    </div>
    <Footer/>
  </div>
}

export default Profile