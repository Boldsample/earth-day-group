import { Link } from "react-router-dom"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { Galleria } from "primereact/galleria"
import { faImage } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons"

const OfferInfo = ({ type = 'full', show, offer, onHide }) => {
  return <Dialog visible={show} onHide={onHide} draggable={false}>
    {offer?.images?.length && 
      <Galleria value={offer?.images} numVisible={5}
        item={({picture}) => <img src={picture} />}
        thumbnail={({picture}) => <img src={picture} />} /> || 
      <div className="default-image"><FontAwesomeIcon icon={faImage} /></div>
    }
    <div className="content">
      <h4>{offer?.title}</h4>
      <div className="fullwidth" style={{fontSize: '0.75rem'}}>{offer?.date}</div>
      <Button label={offer?.material} className={'small mb-1 ' + offer?.material} />
      <p><b>Published by:</b> {offer?.name}</p>
      <p><b>Quantity:</b> {offer?.quantity} {offer?.unit}</p>
      <p><b>Asking price:</b> {parseInt(offer?.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
      {type == 'full' && offer?.status == 0 && 
        <Link className="mt-1 button small green-earth" to={`/chat/${offer?.username}/${offer?.id}/`}><FontAwesomeIcon icon={faPaperPlane} /> Send an offer</Link>
      || null}
    </div>
  </Dialog>
}

export default OfferInfo