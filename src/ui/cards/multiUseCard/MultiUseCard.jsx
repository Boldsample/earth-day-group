import { Link } from "react-router-dom"
import { Button } from "primereact/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookmark as faBookmarkLine, faHeart as faHeartLine } from "@fortawesome/free-regular-svg-icons"
import { faBell, faCheck, faChevronRight, faImage, faLocationDot, faBookmark, faHeart, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useTranslation } from 'react-i18next'

import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"

import "./multiusecard.sass"
import { useSelector } from "react-redux"

const MultiUseCard = ({
  type,
  date,
  title,
  status,
  data = {},
  action = null,
  bookmark = true,
}) => {
  const user = useSelector((state) => state.users.userData)
  const [t] = useTranslation('translation', { keyPrefix: 'ui.cards.multiUseCard'})
	const [tReport] = useTranslation('translation', { keyPrefix: 'admin.reportInfo' })

  const renderCardContent = () => {
    switch (type) {
      case 'notification':
        return <Link to={data?.link}>
          <header>
            <FontAwesomeIcon icon={faBell} />
            <h5>{data?.title}</h5>
            <small>{data?.date}</small>
          </header>
          <p><b>{data?.user}</b> {data?.message}</p>
        </Link>
      case 'offer':
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
      case 'offer_company':
        return <div className="main__container">
          <ProfilePhoto className="offer__image" userPhoto={data?.picture} />
          <div className="fullwidth">
            <h4 className="font-bold text-gray">{data?.title}</h4>
            <Button label={data?.material} className="small green-earth" />
            <Button label={data?.quantity + ' ' + data?.unit} className="small" />
            <div className="flex">
              <p className="date" style={{textAlign: 'left', width: '12.5rem'}}>
                {data?.name}<br />
                Asking price: $ {data?.price}
              </p>
              <p className="date">{data?.date}</p>
            </div>
          </div>
        </div>
      case 'order':
        return <div className="main__container">
          <div>
            <h5 className="font-bold text-gray">{title}</h5>
            <p>Placed on: {date}</p>
          </div>
          <h6 className={status}>{status}</h6>
        </div>
      case 'chat':
        const doActionChat = e => {
          e.preventDefault()
          action({id: data?.incoming, update: new Date(), type: 'chat'})
        }
        return <div className={'main__container'}>
          <a onClick={doActionChat}><ProfilePhoto userPhoto={data?.picture} /></a>
          {(data?.type == 'offer' && 
            <div className="offer">
              <div className="detail">
                <small className="font-bold">
                  {data?.status == data?.id && 
                    <span className="text-green-state">Offer accepted:</span> 
                  || ((data?.rejected || data?.status != 0) && 
                    <span className="text-red-state">Offer rejected:</span> 
                  ) || 
                    <span>Offer {data?.same && 'sent' || 'received'}:</span>
                  }
                </small>
                <h5>{data?.title}</h5>
                <div className="mb-1"><Button label={data?.material} className={'small ' + data?.material} /></div>
                <div><small><b>Quantity:</b> {data?.quantity} {data?.unit}</small></div>
                <div><small><b>Asking price:</b> {parseInt(data?.asking).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</small></div>
                <div className="mt-1" style={{fontSize: '1.125rem'}}><b className="text-green-earth">Proposal:</b> {parseInt(data?.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
              </div>
              {!data?.same && data?.status == 0 && !data?.rejected && 
                <div className="actions">
                  <Button className="small green-state" onClick={() => data?.replyOffer(data?.offer, data?.id)}><FontAwesomeIcon icon={faCheck} /></Button>
                  <Button className="small red-state" onClick={() => data?.replyOffer(data?.offer, data?.id, true)}><FontAwesomeIcon icon={faXmark} /></Button>
                </div> 
              || null}
            </div>) || (data?.type == 'confirmation' && 
            <div className="offer">
              <div className="detail">
                <small><span className="text-green-state">Offer accepted:</span></small>
                <h5>{data?.title}</h5>
                <div className="mb-1"><Button label={data?.material} className={'small ' + data?.material} /></div>
                <div><small><b>Quantity:</b> {data?.quantity} {data?.unit}</small></div>
                <div className="mt-1" style={{fontSize: '1.125rem'}}><b className="text-green-earth">Final price:</b> {parseInt(data?.final).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
              </div>
              {!data?.same && 
                <div className="actions">
                  <Button className="small green-state" style={{width: '6.25rem'}} onClick={() => data?.replyOffer(data?.offer, data?.id)}><FontAwesomeIcon icon={faCheck} /> Pay</Button>
                </div> 
              || null}
            </div>) || <div className="pre-line">{data?.message}</div>
          }
          {data?.type == 'report' && <div className="fullwidth mt-1 mb-1">
            {data?.report_type === 'offer' && 
              <Link className="button dark-blue" to={`/offers/search/${data?.report_entity}/`}>{tReport('view') + ' ' + tReport('reported'+data?.report_type).toLowerCase()}</Link>
            || 
              <Link className="button dark-blue" to={`/${data?.report_type == 'user' ? 'profile' : data?.report_type}/${data?.report_type == 'user' ? data?.report_owner : data?.report_entity}/`}>{tReport('view') + ' ' + tReport('reported'+data?.report_type).toLowerCase()}</Link>
            }
          </div>}
          <div className="date">{data?.date}</div>
        </div>
      case 'user':
        function shortenChatString(str, maxLength) {
            return str.slice(0, maxLength) + "...";
        }
        let link = typeof action != 'function' && `/chat/${data?.username}` || null
        const doActionUser = e => {
          if(typeof action == 'function'){
            e.preventDefault()
            action({id: data?.id, update: new Date()})
          }
        }
        return <Link className="main__container" to={link} onClick={doActionUser}>
          <ProfilePhoto userPhoto={data?.picture} />
          <div>
            <h4 className="font-bold">{data?.name}</h4>
            {data?.lastchat && 
              <span className="text-gray lastChat-textStyles">{data?.lastchat.length > 50 ? shortenChatString(data?.lastchat, 50) : data?.lastchat}</span>
            }
          </div>
          {/* <Link className="button green-earth" to={`/chat/${data?.username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link> */}
        </Link>
      case 'company':
        const doActionCompany = e => {
          e.preventDefault()
          action(data?.id)
        }
        return <div className="main__container">
          <Link to={`/${data?.role}/${data?.username}/`}><ProfilePhoto userPhoto={data?.picture} icon={faImage} /></Link>
          <div className="content">
            <h5 className="font-bold"><Link to={`/${data?.role}/${data?.username}/`}>{data?.name}</Link></h5>
			      {bookmark && 
            	<Link className="bookmark" onClick={doActionCompany}><FontAwesomeIcon icon={data.followed ? faHeart : faHeartLine} /></Link>
			      }
            <span className="text-gray"><FontAwesomeIcon icon={faLocationDot} /> {data?.address}</span>
            <Link className="button small dark-blue" to={`/${data?.role}/${data?.username}/`}>{t('seeMoreBtnText')} <FontAwesomeIcon icon={faChevronRight} /></Link>
          </div>
        </div>
      case 'product':
        const doActionProduct = e => {
          e.preventDefault()
          action(data?.id)
        }
        return <div className="main__container">
          <Link to={`/product/${data?.id}/`}><ProfilePhoto userPhoto={data?.picture} icon={faImage} /></Link>
          <div className="content">
            <div className="price">{parseInt(data?.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
            <h5 className="font-bold"><Link to={`/product/${data?.id}/`}>{data?.name}</Link></h5>
			      {bookmark && 
              <Link className="bookmark" onClick={doActionProduct}><FontAwesomeIcon icon={data.followed ? faHeart : faHeartLine} /></Link>
            }
            <Link className="button small dark-blue" to={`/product/${data?.id}/`}>{t('seeMoreBtnText')} <FontAwesomeIcon icon={faChevronRight} /></Link>
          </div>
        </div>
      case 'pet':
        const doActionPet = e => {
          e.preventDefault()
          action(data?.id)
        }
        return <div className="main__container">
          <Link to={`/pet/${data?.id}/`}><ProfilePhoto userPhoto={data?.picture} icon={faImage} /></Link>
          <div className="content">
            <h5 className="font-bold"><Link to={`/pet/${data?.id}/`}>{data?.name}</Link></h5>
			      {bookmark && 
              <Link className="bookmark" onClick={doActionPet}><FontAwesomeIcon icon={data.followed ? faHeart : faHeartLine} /></Link>
            }
            <small>{data?.gender} - {data?.age} Year{data?.age > 1 ? 's' : ''} old</small>
            <Link className="button small dark-blue" to={`/pet/${data?.id}/`}>{t('seeMoreBtnText')} <FontAwesomeIcon icon={faChevronRight} /></Link>
          </div>
        </div>
      default:
        return null;
    }
  }
  
  const _type = type == 'notification' && data?.readed == 0 ? 'notification unread' : type
  return <div className={`multiUse__card ${_type}`}>{renderCardContent()}</div>;
}

export default MultiUseCard;