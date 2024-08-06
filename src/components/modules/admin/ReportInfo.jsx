import { Link } from "react-router-dom"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { Galleria } from "primereact/galleria"
import { faFlag, faImage } from "@fortawesome/free-solid-svg-icons"
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
      <p><b>Reported {report?.type}:</b> {report?.name}</p>
      <p><b>Subject:</b> {report?.subject}</p>
      <p><b>Description:</b> {report?.description}</p>
      <div><b>Reported by:</b> {report?.uname}</div>
      </div>
    <Tooltip target=".hasTooltip" position="top" />
  </Dialog>
}

export default ReportInfo