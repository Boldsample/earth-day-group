import { Link } from "react-router-dom"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { Galleria } from "primereact/galleria"
import { faFlag, faImage, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons"
import { Tooltip } from "primereact/tooltip"
import { useTranslation } from 'react-i18next'

const ReportInfo = ({ show, report, onHide }) => {
  const [t] = useTranslation('translation', { keyPrefix: 'admin.reportInfo' })
 
  return <Dialog visible={show} onHide={onHide} draggable={false}>
    {report?.images?.length && 
      <Galleria value={report?.images} numVisible={5}
        item={({picture}) => <img src={picture} />}
        thumbnail={({picture}) => <img src={picture} />} /> || 
      <div className="default-image"><FontAwesomeIcon icon={faImage} /></div>
    }
    <div className="content">
      <h4>{t('mainTitle')}</h4>
      <div className="fullwidth mb-4" style={{fontSize: '0.75rem'}}>{report?.date}</div>
      <p><b>{t('reportedEntity')} {report?.type}:</b> <Link to={`/${report?.type}/${report?.entity}/`}>{report?.name}</Link></p>
      {(report?.type == 'product' || report?.type == 'pet') && 
        <p><b>{t('ownerTitle')}</b> <Link to={`/profile/${report?.owner}/`}>{report?.oname} <span className="text-dark-blue"><FontAwesomeIcon icon={faPaperPlane} /></span></Link></p>
      }
      <p><b>{t('subjectTitle')}</b> {report?.subject}</p>
      <p><b>{t('descriptionTitle')}</b> {report?.description}</p>
      <div><b>{t('reportedByTitle')}</b> <Link to={`/profile/${report?.username}/`}>{report?.uname} <span className="text-dark-blue"><FontAwesomeIcon icon={faPaperPlane} /></span></Link></div>
      <div className="mt-3 fullwidth">
        <Link className="button small dark-blue" to={`/${report?.type}/${report?.entity}/`}><FontAwesomeIcon icon={faSearch} /> <span>{t('viewBtn')} {report?.type}</span></Link>
      </div>
    </div>
    <Tooltip target=".hasTooltip" position="top" />
  </Dialog>
}

export default ReportInfo