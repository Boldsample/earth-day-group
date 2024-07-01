import { useSelector } from "react-redux"
import { InputText } from "primereact/inputtext"
import { Paginator } from "primereact/paginator"
import { Link, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons"

import Footer from "@ui/footer/Footer"
import { followUser } from "@services/userServices"
import MultiUseCard from "@ui/cards/multiUseCard/MultiUseCard"
import CardSkeleton from "@ui/skeletons/cardSkeleton/CardSkeleton"

import "../styles.sass"
import ProfileInformation from "@components/modules/profile/ProfileInformation"
import { ListProducts } from "@components/modules/vendor"
import ProfileProducts from "./ProfileProducts"

const ProfileListing = ({content, same, profile, filters, reloadElements = () => false, setFilters = () => false, page, setPage = () => false}) => {
  const user = useSelector((state) => state.users.userData)

  const doFollow = async (id) => {
    await followUser({user: id, follower: user?.id})
    reloadElements()
  }

  return <>
    <div className="layout autoheight">
      <img className="layout__background" src="/assets/full-width.svg" />
      <div className="main__content centerfullwidth">
        <ProfileInformation profile={profile} canEdit={!same} doFollow={doFollow} />
        {profile?.images?.length > 0 && 
          <PhotoGallery imageCatalog={profile?.images} />
        }
      </div>
    </div>
    {(profile?.role == 'vendor' || profile?.role == 'ngo') && 
      <ProfileProducts user={profile?.id} same={user?.id == profile?.id} />
    }
    <div className="layout autoheight fullwidth pt-0">
      <Footer />
    </div>
  </>
}

export default ProfileListing