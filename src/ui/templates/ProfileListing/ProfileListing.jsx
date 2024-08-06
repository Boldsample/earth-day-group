import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import Footer from "@ui/footer/Footer"
import ProfileElements from "./ProfileElements"
import { followUser } from "@services/userServices"
import PhotoGallery from "@components/modules/profile/PhotoGallery"
import ProfileInformation from "@components/modules/profile/ProfileInformation"

import "../styles.sass"

const ProfileListing = ({type, profile, reloadElements = () => false}) => {
  const user = useSelector((state) => state.users.userData)
  const ngoTypes = [
    {
      id: 'products',
      label: 'Products',
      url: user?.id == profile?.id ? '/profile/' : `/${profile?.role}/${profile?.username}/`,
    },
    {
      id: 'pets',
      label: 'Pets Adoptions',
      url: user?.id == profile?.id ? '/profile/pets/' : `/${profile?.role}/${profile?.username}/pets/`,
    },
  ]

  const doFollow = id => {
    followUser({user: id, follower: user?.id})
    reloadElements()
  }
  
  if(!profile?.role)
    return
  return <>
    <div className="layout hasfooter">
      <img className="layout__background" src="/assets/full-width.svg" />
      <div className="main__content centerfullwidth">
        <ProfileInformation profile={profile} same={user?.id == profile?.id} doFollow={doFollow} admin={user?.role == 'admin'} />
        {profile?.images?.length > 0 && 
          <PhotoGallery imageCatalog={profile?.images} />
        }
        {profile?.role != 'company' && 
          <ProfileElements type={type} user={profile?.id} same={user?.id == profile?.id} types={profile?.role == 'ngo' ? ngoTypes : null} />
        }
      </div>
    </div>
    <Footer />
  </>
}

export default ProfileListing