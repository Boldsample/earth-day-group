import React from 'react'
import CompanyInformation from './CompanyInformation'
import PhotoGallery from './PhotoGallery'
import { useDispatch, useSelector } from "react-redux";

import './profile.sass'
const Profile = () => {
  const user = useSelector((state) => state.users.userData);
  console.log(user)
  return (
    <div className="layout">
      <img className="layout__background" src="/assets/register/image-2.svg" />
         <div className="profile__layout">
            <CompanyInformation/>
            <PhotoGallery/>
         </div>
      </div>
  )
}

export default Profile