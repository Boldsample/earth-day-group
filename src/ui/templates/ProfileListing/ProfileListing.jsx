import { useSelector } from "react-redux"

import Footer from "@ui/footer/Footer"
import ProfileProducts from "./ProfileProducts"
import { followUser } from "@services/userServices"
import PhotoGallery from "@components/modules/profile/PhotoGallery"
import ProfileInformation from "@components/modules/profile/ProfileInformation"

import "../styles.sass"

const ProfileListing = ({content, same, profile, filters, reloadElements = () => false, setFilters = () => false, page, setPage = () => false}) => {
  const user = useSelector((state) => state.users.userData)

  const doFollow = async (id) => {
    await followUser({user: id, follower: user?.id})
    reloadElements()
  }

  return <>
    <div className="layout hasfooter">
      <img className="layout__background" src="/assets/full-width.svg" />
      <div className="main__content centerfullwidth">
        <ProfileInformation profile={profile} canEdit={!same} doFollow={doFollow} />
        {profile?.images?.length > 0 && 
          <PhotoGallery imageCatalog={profile?.images} />
        }
      </div>
      {(profile?.role == 'vendor' || profile?.role == 'ngo') && 
        <ProfileProducts user={profile?.id} same={user?.id == profile?.id} />
      }
    </div>
    <Footer />
  </>
}

export default ProfileListing