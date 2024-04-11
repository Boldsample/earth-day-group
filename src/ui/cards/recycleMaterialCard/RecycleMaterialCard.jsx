import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCircle } from "@fortawesome/free-solid-svg-icons";
import "./recycleMaterialCard.sass";

const RecycleMaterialCard = () => {
  return (
    <div className="recycle__card">
      <FontAwesomeIcon icon={faCircle} />
      <div className="body__container">
        <p>Paper</p>
        <p>1kg:$2.5</p>
      </div>
      <div className="close__icon">
        <FontAwesomeIcon icon={faClose} />
      </div>
    </div>
  );
};

export default RecycleMaterialCard;
