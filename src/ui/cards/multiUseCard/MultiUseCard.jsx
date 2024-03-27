import React from 'react';
import './multiusecard.sass'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell} from "@fortawesome/free-solid-svg-icons";
import companyLogo from "@assets/test-img.png";

const MultiUseCard = ({ type, title, description, date, offer, orderStatus }) => {
  const renderCardContent = () => {
    switch (type) {
      case 'notification':
        return (
          <>
            <div className='multiUse__header'>
              <div className='multiUse__title'>
                <FontAwesomeIcon icon={faBell} />
                <h4 className="font-bold">{title}</h4>
              </div>
              <div className='multiuse__date'>
                <small>{date}</small>
              </div>
            </div>
            <div className='multiUse__Body'>
            <p className='multiuseCard__p'>{description}</p>
            </div>
          </>
        );
      case 'offer':
        return (
          <>
          <div className='offer__container'>
                <div className="left__container">
                    <div className='offer__image'>
                        <img  src={companyLogo} alt={title} width='70px' />
                    </div>
                    <div className='offer__mainInfo'>
                        <h4>{title}</h4>
                        <p className='multiuseCard__p'>{description}</p>
                        <small>{offer}</small>
                    </div>
                </div>
            <div className='offer__status'>
                <small>{date}</small>
                <small>{orderStatus}</small>
            </div>
          </div>
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