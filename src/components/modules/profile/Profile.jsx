import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import Footer from "@ui/footer/Footer"
import { ListProducts } from "../vendor"
import PhotoGallery from "./PhotoGallery"
import {  getUser } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import ProfileInformation from "./ProfileInformation"
import LoadingContentOverlay from "@ui/spinner/LoadingContentOverlay"

import "./profile.sass"
import ProfileListing from "@ui/templates/ProfileListing/ProfileListing"

const Profile = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [ profile, setProfile ] = useState(null)
  const user = useSelector((state) => state.users.userData)
  const profileTemplateContent = {
    title: 'MARKET PLACE',
    searchLabel: 'Discover products',
    bannerImage: 'url(/assets/user/image-7.svg)',
    types: [
      {
        card: 'company',
        url: '/vendors/',
        label: 'Vendors',
      },
      {
        card: 'product',
        label: 'Products',
        url: '/products/',
      },
    ],
    secondary: [
      {
        title: '100% Recycled',
        icon: '/assets/icons/recycleCompanyIcon1.svg',
      },
      {
        title: 'Eco Friendly',
        icon: '/assets/icons/recycleCompanyIcon2.svg',
      },
      {
        title: 'Sustainable Economy',
        icon: '/assets/icons/recycleCompanyIcon3.svg',
      },
    ]
  }

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

  return <ProfileListing content={profileTemplateContent} same={id} profile={profile} />

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