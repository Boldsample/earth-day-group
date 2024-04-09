import React from 'react'
import FileUploadInput from '../fileUploadInput';
import './uploadprofilephotoinput.sass'
import ProfilePhoto from '../../profilePhoto/ProfilePhoto'

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