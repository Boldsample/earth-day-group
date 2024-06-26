import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import Footer from "@ui/footer/Footer"
import { ListProducts } from "../vendor"
import PhotoGallery from "./PhotoGallery"
import ProfileInformation from "./ProfileInformation"
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
    <div className="layout widthfooter">
      <img className="layout__background" src="/assets/full-width.svg" />
      <div className="main__content centerfullwidth">
        <ProfileInformation profile={profile} canEdit={!id} doFollow={doFollow} />
        {profile?.images?.length > 0 && 
          <PhotoGallery imageCatalog={profile?.images} />
        }
        {(profile?.role == 'vendor' || profile?.role == 'ngo') && <>
          {user.id == profile?.id && 
            <Link className="button green-earth self-end" to="/product/new/"><FontAwesomeIcon icon={faPlus} /> Crear producto</Link>
          }
          <ListProducts id={profile?.id} />
        </>}
      </div>
    </div>
    <Footer/>
  </LoadingContentOverlay>
}

export default Profile