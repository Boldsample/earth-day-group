import { Link } from "react-router-dom"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { Galleria } from "primereact/galleria"
import { faFlag, faImage, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons"
import { Tooltip } from "primereact/tooltip"
import { useTranslation } from 'react-i18next'
import { useSelector } from "react-redux"
import { updateOfferData } from "@services/offersServices"
import { useState } from "react"
import ConfirmationModal from "@ui/modals/ConfirmationModal"

const OfferInfo = ({ type = 'full', show, offer, onHide }) => {
  const [ confirm, setConfirm ] = useState(null)
  const user = useSelector((state) => state.users.userData)
	const [t] = useTranslation('translation', { keyPrefix: 'offers.offerInfo'})
  const [tMaterial] = useTranslation('translation', { keyPrefix: 'materials'})

  const changeState = async action => {
    setConfirm(false)
    if(action){
      await updateOfferData({state: 2}, {id: offer?.id})
      onHide()
    }
  }

  return <>
    <ConfirmationModal title={t('deleteOfferTitle')} visible={confirm} action={changeState} />
    <Dialog visible={show} onHide={onHide} draggable={false}>
      {offer?.images?.length && 
        <Galleria value={offer?.images} numVisible={5}
          item={({picture}) => <img src={picture} />}
          thumbnail={({picture}) => <img src={picture} />} /> || 
        <div className="default-image"><FontAwesomeIcon icon={faImage} /></div>
      }
      <div className="content">
        <h4 className="flex">
          {offer?.title}
          {user?.role != 'admin' && 
            <Link className="button small red-state outline hasTooltip ml-2" to={`/report/offer/${offer?.id}/`} data-pr-tooltip={t('reportOfferToolTip')}><FontAwesomeIcon icon={faFlag} /></Link>
          }
        </h4>
        <div className="fullwidth" style={{fontSize: '0.75rem'}}>{offer?.date}</div>
        <Button label={tMaterial(offer?.material)} className={'small mb-1 ' + offer?.material} />
        <p><b>{t('descriptionTitle')}</b> {offer?.description}</p>
        <p><b>{t('publishedByTitle')}</b> {offer?.name}</p>
        <p><b>{t('quantityTitle')}</b> {offer?.quantity} {offer?.unit}</p>
        <p><b>{t('askingPriceTitle')}</b> {parseInt(offer?.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
        {user?.role != 'admin' && type == 'full' && offer?.status == 0 && 
          <Link className="mt-1 button small green-earth" to={`/chat/${offer?.username}/${offer?.id}/`}><FontAwesomeIcon icon={faPaperPlane} /> {t('sendOfferBtn')}</Link>
        }
        {user?.role == 'admin' && 
          <Button onClick={() => setConfirm(true)} className="mt-1 small red-state"><FontAwesomeIcon icon={faTrash} /> {t('deleteOffer')}</Button>
        }
      </div>
      <Tooltip target=".hasTooltip" position="top" />
    </Dialog>
  </>
}

export default OfferInfo