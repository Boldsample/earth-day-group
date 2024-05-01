import React from 'react'
import CompanyInformation from './CompanyInformation'
import PhotoGallery from './PhotoGallery'
import './profile.sass'

const Profile = () => {
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