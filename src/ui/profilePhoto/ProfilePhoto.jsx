import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "./profilePhoto.sass"

const ProfilePhoto = ({ userPhoto, className, size}) => {
	return <div className={`profile__photo `+className}>
		{userPhoto ? (
			<img className="icon__background" src={userPhoto}  alt="User Photo" />
		) : (
			<FontAwesomeIcon style={{fontSize: size}} icon={faUser} />
		)}
	</div>
}

export default ProfilePhoto