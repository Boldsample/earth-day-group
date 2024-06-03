import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "./profilePhoto.sass"

const ProfilePhoto = ({ userPhoto, className = '', size, pictures }) => {
  const picture = pictures?.length ? pictures[0]?.picture : null
  const photo = userPhoto ? userPhoto : picture

  return <div className={`profile__photo `+className}>
    {photo ? 
      <img className="icon__background" src={photo}  alt="User Photo" /> : 
      <FontAwesomeIcon style={{fontSize: size}} icon={faUser} />
    }
  </div>
}

export default ProfilePhoto