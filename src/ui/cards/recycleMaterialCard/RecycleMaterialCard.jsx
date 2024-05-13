import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCircle } from "@fortawesome/free-solid-svg-icons";
import "./recycleMaterialCard.sass";

const RecycleMaterialCard = ({material, unit, price,  color, removeMaterial}) => {
  

  return (
    <div className="recycle__card">
      <FontAwesomeIcon icon={faCircle} className={color} />
      <div className="body__container">
        <p>{material}</p>
        <p>1{unit}: ${price}</p>
      </div>
      {removeMaterial &&  <button className="close__icon" onClick={()=> removeMaterial(material)}>
        <FontAwesomeIcon icon={faClose} />
      </button>}
    </div>
  );
};

export default RecycleMaterialCard;
