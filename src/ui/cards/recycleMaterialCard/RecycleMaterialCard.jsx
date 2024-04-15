import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCircle } from "@fortawesome/free-solid-svg-icons";
import "./recycleMaterialCard.sass";

const RecycleMaterialCard = ({material, unit, price,  color}) => {
  return (
    <div className="recycle__card">
      <FontAwesomeIcon icon={faCircle} className={color} />
      <div className="body__container">
        <p>{material}</p>
        {/* <p>1kg:$2.5</p> */}
        <p>{unit}: {price}</p>
      </div>
      <button className="close__icon">
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  );
};

export default RecycleMaterialCard;
