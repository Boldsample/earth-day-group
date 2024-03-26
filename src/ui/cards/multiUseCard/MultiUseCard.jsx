import React from 'react';
import './multiusecard.sass'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell} from "@fortawesome/free-solid-svg-icons";

const MultiUseCard = ({ type, title, description, date }) => {
  // Conditional rendering based on the type prop
  const renderCardContent = () => {
    switch (type) {
      case 'notification':
        return (
          <>
            <div className='multiUse__header'>
              <div className='multiUse__title'>
                <FontAwesomeIcon icon={faBell} />
                <p className="font-bold">{title}</p>
              </div>
              <div className='multiuse__date'>
                <small>{date}</small>
              </div>
            </div>
            <div className='multiUse__Body'>
            <p>{description}</p>
            </div>
          </>
        );
      case 'type2':
        return (
          <>
            <h3>{title}</h3>
            <p>{description}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="multiUse__card">
      {renderCardContent()}
    </div>
  );
};

export default MultiUseCard;