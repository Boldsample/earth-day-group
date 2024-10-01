import { Link } from "react-router-dom"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { Galleria } from "primereact/galleria"
import { faFlag, faImage } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons"
import { Tooltip } from "primereact/tooltip"
import { useTranslation } from 'react-i18next'

const OfferInfo = ({ type = 'full', show, offer, onHide }) => {
	const [t] = useTranslation('translation', { keyPrefix: 'offers.offerInfo'})
	const [tMaterial] = useTranslation('translation', { keyPrefix: 'materials'})

  return <Dialog visible={show} onHide={onHide} draggable={false}>
    {offer?.images?.length && 
      <Galleria value={offer?.images} numVisible={5}
        item={({picture}) => <img src={picture} />}
        thumbnail={({picture}) => <img src={picture} />} /> || 
      <div className="default-image"><FontAwesomeIcon icon={faImage} /></div>
    }
    <div className="content">
      <h4 className="flex">
        {offer?.title}
        <Link className="button small red-state outline hasTooltip ml-2" to={`/report/offer/${offer?.id}/`} data-pr-tooltip={t('reportOfferToolTip')}><FontAwesomeIcon icon={faFlag} /></Link>
      </h4>
      <div className="fullwidth" style={{fontSize: '0.75rem'}}>{offer?.date}</div>
      <Button label={tMaterial(offer?.material)} className={'small mb-1 ' + offer?.material} />
      <p><b>{t('publishedByTitle')}</b> {offer?.name}</p>
      <p><b>{t('quantityTitle')}</b> {offer?.quantity} {offer?.unit}</p>
      <p><b>{t('askingPriceTitle')}</b> {parseInt(offer?.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
      {type == 'full' && offer?.status == 0 && 
        <Link className="mt-1 button small green-earth" to={`/chat/${offer?.username}/${offer?.id}/`}><FontAwesomeIcon icon={faPaperPlane} /> {t('sendOfferBtn')}</Link>
      || null}
    </div>
    <Tooltip target=".hasTooltip" position="top" />
  </Dialog>
}

export default OfferInfo