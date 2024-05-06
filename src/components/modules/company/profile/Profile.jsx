import React, {useState, useEffect} from 'react'
import CompanyInformation from './CompanyInformation'
import PhotoGallery from './PhotoGallery'
import { useDispatch, useSelector } from "react-redux";
import './profile.sass'

const Profile = () => {
  const user = useSelector((state) => state.users.userData);
  const [imageCatalog, setImageCatalog] = useState([null])
 
  // const {images} = user
console.log(user)

  useEffect(()=>{
    setImageCatalog(user.images)
  }, [])

  return (
    <div className="layout">
      <img className="layout__background" src="/assets/register/image-2.svg" />
         <div className="profile__layout">
            <CompanyInformation
              company={user}
            />
            <PhotoGallery
              imageCatalog={imageCatalog}
            />
         </div>
      </div>
  )
}

export default Profile