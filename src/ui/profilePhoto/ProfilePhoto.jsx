import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "./profilePhoto.sass"

const ProfilePhoto = ({ userPhoto }) => {
	return <div className="profile__photo">
		{userPhoto ? (
			<img className="icon__background" src={userPhoto}  alt="User Photo" />
		) : (
			<FontAwesomeIcon icon={faUser} />
		)}
	</div>
}

export default ProfilePhoto