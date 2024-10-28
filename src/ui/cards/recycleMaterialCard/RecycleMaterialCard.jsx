import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCircle } from "@fortawesome/free-solid-svg-icons";

import "./recycleMaterialCard.sass";
import { useTranslation } from "react-i18next"
import materials from "@json/recyclableMaterials.json"

const RecycleMaterialCard = ({material, unit, price, currency = 'usd', removeMaterial}) => {
	const [tMaterial, i18n] = useTranslation('translation', {keyPrefix: 'materials'})
  
  return (
    <div className={'recycle__card ' + (materials?.find(category => category?.items.find(item => item?.label == material))?.code || '')}>
      <div className="body__container">
        <span className="circle"></span>
        <span className="name"> {tMaterial(material)}</span>
        <p><span className="pill">1 {tMaterial(unit+'_min')}</span> <b>{Intl.NumberFormat(i18n.language == 'es' ? 'es-CO' : 'en-US', {style: 'currency', currency: currency?.toUpperCase()}).format(price)}</b></p>
      </div>
      {removeMaterial &&  <button className="close__icon" onClick={()=> removeMaterial(material)}>
        <FontAwesomeIcon icon={faClose} />
      </button>}
    </div>
  );
};

export default RecycleMaterialCard;
