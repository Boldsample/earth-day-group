import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Footer from "@ui/footer/Footer"
// import PhotoGallery from "./PhotoGallery"
// import CompanyInformation from "./CompanyInformation"
import { getUser } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"

import "./profile.sass"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import PhotoGallery from "@components/modules/profile/PhotoGallery"

const ListingProfile = ({children}) => {
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
            <div className='companyInformation__grid'>
                <div className="image__container">
                    <ProfilePhoto className="profile__photo-large" size="4.6875rem" userPhoto={profile?.picture}/>
                </div>
                <div className="companyInformation__container">
                    {children}
                </div>
            </div>
            {profile?.images && <PhotoGallery imageCatalog={profile?.images} />}
            {/* {profile?.products && <PhotoGallery imageCatalog={profile?.images} />} */}
        </div>
    <Footer/>
    </div>
}

export default ListingProfile