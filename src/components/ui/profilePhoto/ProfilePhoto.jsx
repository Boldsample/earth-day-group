import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './profilePhoto.sass'

const ProfilePhoto = () => {
  return (
    <div className='icon__background'>
        <FontAwesomeIcon icon={faUser} />
    </div>

  )
}

export default ProfilePhoto