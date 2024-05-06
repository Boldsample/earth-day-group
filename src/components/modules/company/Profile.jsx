import React, {useState, useEffect} from 'react'
import CompanyInformation from './CompanyInformation'
import PhotoGallery from './PhotoGallery'
import { useDispatch, useSelector } from "react-redux";

import './profile.sass'
import { useState } from 'react'
const Profile = () => {
  const user = useSelector((state) => state.users.userData);
  const {images} = user
  console.log(user, images)
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