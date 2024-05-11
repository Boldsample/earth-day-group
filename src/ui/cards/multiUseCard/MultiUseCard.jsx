import { Button } from "primereact/button"
import { faBell } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import companyLogo from "@assets/test-img.png"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"

import "./multiusecard.sass"

const MultiUseCard = ({
  type,
  date,
  title,
  price,
  offers,
  status,
  receive,
  material,
  quantity,
  description,
  offer,
  orderStatus,
}) => {
const renderCardContent = () => {
  switch (type) {
  case "notification":
    return <>
      <div className="notification__header">
        <div className="notification__title">
          <FontAwesomeIcon icon={faBell} />
          <h4 className="font-bold">{title}</h4>
        </div>
        <div className="notification__date">
          <small>{date}</small>
        </div>
      </div>
      <div className="notification__Body">
        <p className="multiuseCard__p">{description}</p>
      </div>
    </>
  case "offer":
    return <div className="main__container">
      <ProfilePhoto userPhoto={offer?.picture} />
      <div className="fullwidth">
        <h4 className="font-bold text-gray">{offer?.title}</h4>
        <Button label={offer?.material} className="small green-earth" />
        <div className="flex">
          <table>
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Asking Price</th>
                <th>Offers</th>
                <th>Receive</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{offer?.quantity + ' ' + offer?.unit}</td>
                <td>{offer?.price}</td>
                <td>{offer?.offers || 0}</td>
                <td><i className="pi pi-eye" /></td>
              </tr>
            </tbody>
          </table>
          <p className="date">{offer?.date}</p>
        </div>
      </div>
    </div>
  case "offer_company":
    return <div className="main__container">
      <ProfilePhoto className="offer__image" userPhoto={offer?.picture} />
      <div className="fullwidth">
        <h4 className="font-bold text-gray">{offer?.title}</h4>
        <Button label={offer?.material} className="small green-earth" />
        <Button label={offer?.quantity + ' ' + offer?.unit} className="small" />
        <div className="flex">
          <p className="date" style={{textAlign: 'left', width: '200px'}}>
            {offer?.name}<br />
            Asking price: $ {offer?.price}
          </p>
          <p className="date">{offer?.date}</p>
        </div>
      </div>
    </div>
  case "order":
    return <div className="main__container">
      <div>
        <h5 className="font-bold text-gray">{title}</h5>
        <p>Placed on: {date}</p>
      </div>
      <h6 className={status}>{status}</h6>
    </div>
  default:
    return null;
  }
};

  return <div className={`multiUse__card ${type}`}>{renderCardContent()}</div>;
};

export default MultiUseCard;
