import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./profilePhoto.sass";

const ProfilePhoto = ({ userPhoto }) => {
  console.log(userPhoto);
  return (
    <div className="icon__background">
      {userPhoto ? (
        <img src={userPhoto} width="10px" alt="User Photo" />
      ) : (
        <FontAwesomeIcon icon={faUser} />
      )}
    </div>
  );
};

export default ProfilePhoto;
