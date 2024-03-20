import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./profilePhoto.sass";

const ProfilePhoto = ({ userPhoto }) => {
  return (
    <div className="icon__background">
      {userPhoto ? (
        <img className="icon__background" src={userPhoto}  alt="User Photo" />
      ) : (
        <FontAwesomeIcon icon={faUser} />
      )}
    </div>
  );
};

export default ProfilePhoto;
