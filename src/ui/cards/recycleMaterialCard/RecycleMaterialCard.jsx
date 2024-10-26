import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCircle } from "@fortawesome/free-solid-svg-icons";

import "./recycleMaterialCard.sass";
import materials from "@json/recyclableMaterials.json"
import { useTranslation } from "react-i18next";

const RecycleMaterialCard = ({material, unit, price,  color, removeMaterial}) => {
	const [tMaterial] = useTranslation('translation', {keyPrefix: 'materials'})

  return (
    <div className={'recycle__card ' +  materials?.find(category => category?.items.find(item => item?.label == material))?.code || ''}>
      <div className="body__container">
        <span className="circle"></span>
        <span className="name"> {tMaterial(material)}</span>
        <p><span className="pill">1 {tMaterial(unit+'_min')}</span> <b>${price}</b></p>
      </div>
      {removeMaterial &&  <button className="close__icon" onClick={()=> removeMaterial(material)}>
        <FontAwesomeIcon icon={faClose} />
      </button>}
    </div>
  );
};

export default RecycleMaterialCard;
