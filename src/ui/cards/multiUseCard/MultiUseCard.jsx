import { Link } from "react-router-dom"
import { Button } from "primereact/button"
import { faBell } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import companyLogo from "@assets/test-img.png"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"

import "./multiusecard.sass"

const MultiUseCard = ({
  type,
  date,
  data,
  title,
  status,
  message,
  description,
}) => {
const renderCardContent = () => {
  switch (type) {
  case "notification":
    return <Link to={data.link}>
      <div className="notification__header">
        <div className="notification__title">
          <FontAwesomeIcon icon={faBell} />
          <h4 className="font-bold">{data.title}</h4>
        </div>
        <div className="notification__date">
          <small>{data.date}</small>
        </div>
      </div>
      <div className="notification__Body">
        <p className="multiuseCard__p">{data.message}</p>
      </div>
    </Link>
  case "offer":
    return <div className="main__container">
      <ProfilePhoto userPhoto={data?.picture} />
      <div className="fullwidth">
        <h4 className="font-bold text-gray">{data?.title}</h4>
        <Button label={data?.material} className="small green-earth" />
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
                <td>{data?.quantity + ' ' + data?.unit}</td>
                <td>{data?.price}</td>
                <td>{data?.offers || 0}</td>
                <td><i className="pi pi-eye" /></td>
              </tr>
            </tbody>
          </table>
          <p className="date">{data?.date}</p>
        </div>
      </div>
    </div>
  case "offer_company":
    return <div className="main__container">
      <ProfilePhoto className="offer__image" userPhoto={data?.picture} />
      <div className="fullwidth">
        <h4 className="font-bold text-gray">{data?.title}</h4>
        <Button label={data?.material} className="small green-earth" />
        <Button label={data?.quantity + ' ' + data?.unit} className="small" />
        <div className="flex">
          <p className="date" style={{textAlign: 'left', width: '200px'}}>
            {data?.name}<br />
            Asking price: $ {data?.price}
          </p>
          <p className="date">{data?.date}</p>
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
  case "chat":
    return <div className={'main__container '+status}>
      <ProfilePhoto userPhoto={message?.picture} />
      {message.message}
      <div className="date">{message.date}</div>
    </div>
  default:
    return null;
  }
};

  return <div className={`multiUse__card ${type}`}>{renderCardContent()}</div>;
};

export default MultiUseCard;
