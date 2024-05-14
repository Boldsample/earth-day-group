import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import LoadingOverlay from 'react-loading-overlay'
import Footer from "@ui/footer/Footer"
import PhotoGallery from "./PhotoGallery"
import { getUser } from "@services/userServices"
import { setHeader, loadingData } from "@store/slices/globalSlice"
import CompanyInformation from "./CompanyInformation"

import "./profile.sass"

const Profile = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [ profile, setProfile ] = useState(null)
  const user = useSelector((state) => state.users.userData)
  const loading = useSelector((state) => state.global.loading)
 
  const getProfileData = async () => {
    const _profile = await getUser(id)
    setProfile(_profile)
  }

  useEffect(() => {
    if(profile == null){
      dispatch(loadingData(true))
    }else{
      dispatch(loadingData(false))
    }
    if(id)
      getProfileData()
    else
      setProfile(user)
		dispatch(setHeader('user'))
  }, [profile])

  return profile && <div className="layout">
    {/* <LoadingOverlay
      active={loading}
      spinner
    > */}
    {/*<img className="layout__background" src="/assets/register/image-2.svg" />*/}
    <div className="profile__layout">
      <CompanyInformation company={profile} canEdit={!id} />
      <PhotoGallery imageCatalog={profile?.images} />
    </div>
    <Footer/>
    {/* </LoadingOverlay> */}
  </div>
}

export default Profile