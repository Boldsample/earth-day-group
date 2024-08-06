import { Link } from "react-router-dom"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { Galleria } from "primereact/galleria"
import { faFlag, faImage, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons"
import { Tooltip } from "primereact/tooltip"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"

const ReportInfo = ({ show, report, onHide }) => {
  console.log(report)
  return <Dialog visible={show} onHide={onHide} draggable={false}>
    {report?.images?.length && 
      <Galleria value={report?.images} numVisible={5}
        item={({picture}) => <img src={picture} />}
        thumbnail={({picture}) => <img src={picture} />} /> || 
      <div className="default-image"><FontAwesomeIcon icon={faImage} /></div>
    }
    <div className="content">
      <h4>Report detail</h4>
      <div className="fullwidth mb-4" style={{fontSize: '0.75rem'}}>{report?.date}</div>
      <p><b>Reported {report?.type}:</b> <Link to={`/${report?.type}/${report?.entity}/`}>{report?.name}</Link></p>
      {(report?.type == 'product' || report?.type == 'pet') && 
        <p><b>Owner:</b> <Link to={`/profile/${report?.owner}/`}>{report?.oname} <span className="text-dark-blue"><FontAwesomeIcon icon={faPaperPlane} /></span></Link></p>
      }
      <p><b>Subject:</b> {report?.subject}</p>
      <p><b>Description:</b> {report?.description}</p>
      <div><b>Reported by:</b> <Link to={`/profile/${report?.username}/`}>{report?.uname} <span className="text-dark-blue"><FontAwesomeIcon icon={faPaperPlane} /></span></Link></div>
      <div className="mt-3 fullwidth">
        <Link className="button small dark-blue" to={`/${report?.type}/${report?.entity}/`}><FontAwesomeIcon icon={faSearch} /> <span>View {report?.type}</span></Link>
      </div>
    </div>
    <Tooltip target=".hasTooltip" position="top" />
  </Dialog>
}

export default ReportInfo