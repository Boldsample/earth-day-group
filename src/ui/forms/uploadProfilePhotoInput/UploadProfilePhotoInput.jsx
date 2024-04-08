import React from 'react'
import UploadProfilePhotoInput from '@forms/uploadProfilePhotoInput'
import ProfilePhoto from '@forms/profilePhoto'
import './uploadprofilephotoinput.sass'

const UploadProfilePhotoInput = ({photoFileBlob, setPhotoFileBlob}) => {
  return (
    <div className="profile__container">
      <div className="profilePicture__container">
        <ProfilePhoto userPhoto={photoFileBlob} />
      </div>
      <div className="profileUpload__container">
        <h5 className="profileUpload__title text-defaultCase">
          Profile Picture
        </h5>
        <FileUploadInput setPhotoFileBlob={setPhotoFileBlob} />
      </div>
    </div>
  );
};

export default UploadProfilePhotoInput