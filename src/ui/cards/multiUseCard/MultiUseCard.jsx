import { Link } from "react-router-dom"
import { Button } from "primereact/button"
import { faBell, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"

import "./multiusecard.sass"

const MultiUseCard = ({
  type,
  date,
  data,
  title,
  status,
  message
}) => {
  const renderCardContent = () => {
    switch (type) {
      case "notification":
        return <Link to={data?.link}>
          <header>
            <FontAwesomeIcon icon={faBell} />
            <h5>{data?.title}</h5>
            <small>{data?.date}</small>
          </header>
          <p><b>{data?.user}</b> {data?.message}</p>
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
        return <div className={'main__container'}>
          <ProfilePhoto userPhoto={message?.picture} />
          {message?.type == 'message' && 
            message?.message || 
            <div className="offer">
              <div className="detail">
                <small>
                  {message?.status == message.id && 
                    <span className="text-green-state">Offer accepted:</span> 
                  || ((message?.rejected || message?.status != 0) && 
                    <span className="text-red-state">Offer rejected:</span> 
                  ) || 
                    <span>Offer {message?.same && 'sent' || 'received'}:</span>
                  }
                </small>
                <h5 className={message?.same && 'text-white' || null}>{message?.title}</h5>
                <div className="mb-1"><Button label={message?.material} className={'small ' + message?.material} /></div>
                <div><small><b>Quantity:</b> {message?.quantity} {message?.unit}</small></div>
                <div><small><b>Asking price:</b> {parseInt(message?.asking).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</small></div>
                <div className="mt-1" style={{fontSize: '18px'}}><b className={message?.same && 'text-white' || 'text-green-earth'}>Proposal:</b> {parseInt(message?.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
              </div>
              {!message?.same && message?.status == 0 && !message.rejected && 
                <div className="actions">
                  <Button className="small green-state" onClick={() => message.replyOffer(message.offer, message.id)}><FontAwesomeIcon icon={faCheck} /></Button>
                  <Button className="small red-state" onClick={() => message.replyOffer(message.offer, message.id, true)}><FontAwesomeIcon icon={faXmark} /></Button>
                </div> 
              || null}
            </div>
          }
          <div className="date">{message?.date}</div>
        </div>
      default:
        return null;
    }
  }
  
  return <div className={`multiUse__card ${type}`}>{renderCardContent()}</div>;
}

export default MultiUseCard;