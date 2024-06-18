import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Footer from "@ui/footer/Footer"
import PhotoGallery from "./PhotoGallery"
import CompanyInformation from "./CompanyInformation"
import { followUser, getUser } from "@services/userServices"
import { setHeader, loadingData } from "@store/slices/globalSlice"
import LoadingContentOverlay from "@ui/spinner/LoadingContentOverlay"

import "./profile.sass"

const Profile = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [ profile, setProfile ] = useState(null)
  const user = useSelector((state) => state.users.userData)
  const loading = useSelector((state) => state.global.loading)
 
  const doFollow = async () => {
    await followUser({user: profile.id, follower: user.id})
    setProfile(null)
  }
  const getProfileData = async () => {
    const _profile = await getUser(id, user?.id)
    setProfile(_profile)
  }

  useEffect(() => {
    if(profile == null)
      dispatch(loadingData(true))
    else
      dispatch(loadingData(false))
    if(profile == null && id)
      getProfileData()
    else if(profile == null)
      setProfile(user)
		dispatch(setHeader('user'))
  }, [profile])

  return profile && <LoadingContentOverlay>
    <div className="layout">
      {/*<img className="layout__background" src="/assets/register/image-2.svg" />*/}
      <div className="main__content centerfullwidth">
        <CompanyInformation company={profile} canEdit={!id} doFollow={doFollow} />
        <PhotoGallery imageCatalog={profile?.images} />
      </div>
    </div>
    <Footer/>
  </LoadingContentOverlay>
}

export default Profile