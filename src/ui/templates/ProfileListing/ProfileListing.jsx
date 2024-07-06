import { useSelector } from "react-redux"

import Footer from "@ui/footer/Footer"
import ProfileElements from "./ProfileElements"
import { followUser } from "@services/userServices"
import PhotoGallery from "@components/modules/profile/PhotoGallery"
import ProfileInformation from "@components/modules/profile/ProfileInformation"

import "../styles.sass"

const ProfileListing = ({profile, reloadElements = () => false}) => {
  const user = useSelector((state) => state.users.userData)

  const doFollow = async (id) => {
    await followUser({user: id, follower: user?.id})
    reloadElements()
  }

  return <>
    <div className="layout hasfooter">
      <img className="layout__background" src="/assets/full-width.svg" />
      <div className="main__content centerfullwidth">
        <ProfileInformation profile={profile} same={user?.id == profile?.id} doFollow={doFollow} />
        {profile?.images?.length > 0 && 
          <PhotoGallery imageCatalog={profile?.images} />
        }
        {(profile?.role == 'vendor' || profile?.role == 'social' || profile?.role == 'ngo') && 
          <ProfileElements type="products" user={profile?.id} same={user?.id == profile?.id} />
        || ((profile?.role == 'shelter' || profile?.role == 'ngo') && 
          <ProfileElements type="adoption" user={profile?.id} same={user?.id == profile?.id} />
      )}
      </div>
    </div>
    <Footer />
  </>
}

export default ProfileListing