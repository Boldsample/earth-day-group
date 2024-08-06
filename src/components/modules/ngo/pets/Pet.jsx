import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Footer from "@ui/footer/Footer"
import { getPet } from "@services/petServices"
import { setHeader } from "@store/slices/globalSlice"

import "../../profile/profile.sass"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import { faBookmark, faCartPlus, faFlag, faPaw, faSignal, faTrash, faVenusMars, faWeightScale } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import PhotoGallery from "@components/modules/profile/PhotoGallery"
import ProfileElements from "@ui/templates/ProfileListing/ProfileElements"
import { faBookmark as faBookmarkLine, faPaperPlane } from "@fortawesome/free-regular-svg-icons"
import { Tooltip } from "primereact/tooltip"

const Pet = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [ pet, setPet ] = useState(null)
  const user = useSelector((state) => state.users.userData)

  const doFollow = async e => {
    e.preventDefault()
    await followPet({type: 'pets', entity: id, follower: user?.id})
    getPetData()
  }
  const getPetData = async () => {
    const _pet = await getPet(id)
    setPet(_pet)
  }

  useEffect(() => {
    if(id)
      getPetData()
		dispatch(setHeader('user'))
  }, [id])
  
  return <>
    <div className="layout hasfooter">
      <img className="layout__background" src="/assets/full-width.svg" />
      <div className="main__content centerfullwidth">
        <div className="profileInformation__grid">
          <div className="image__container">
            {pet?.images?.length > 0 && 
              <PhotoGallery type="min" imageCatalog={pet?.images} /> ||
              <ProfilePhoto className="profile__photo-large" size="12.5rem" userPhoto={null}/>
            }
          </div>
          <div className="profileInformation__container">
            <h2>{pet?.name} {pet?.type ? `(${pet?.type})`: ''}</h2>
            <p className="mt-2 mb-4">{pet?.description}</p>
            <ul className="contact__grid">
              <li><FontAwesomeIcon icon={faVenusMars}  className='contact__icon'/>{pet?.gender}</li>
              <li><FontAwesomeIcon icon={faPaw}  className='contact__icon'/>{pet?.breed}</li>
              <li><FontAwesomeIcon icon={faSignal}  className='contact__icon'/>{pet?.age} years old</li>
              <li><FontAwesomeIcon icon={faWeightScale}  className='contact__icon'/>{pet?.weight} Kg</li>
            </ul>
            {user?.id != pet?.user && user?.role != 'admin' && <>
              <Link className="button small dark-blue" onClick={doFollow}><FontAwesomeIcon icon={pet?.followed ? faBookmark : faBookmarkLine} /></Link>
              <Link to={`/chat/${pet?.username}/`} className="button small green-earth"><FontAwesomeIcon icon={faPaperPlane} /> <span>Contact shelter</span></Link>
              <Link className="button small red-state outline hasTooltip" to={`/report/pet/${pet?.id}/`} data-pr-tooltip="Report pet"><FontAwesomeIcon icon={faFlag} /></Link>
            </> || <>
              <Link to={`/pet/edit/${pet?.id}/`} className="button small dark-blue"><FontAwesomeIcon icon={faCartPlus} /> <span>Edit</span></Link>
              <Link className="button small red-state"><FontAwesomeIcon icon={faTrash} /> <span>Delete</span></Link>
            </>}
          </div>
        </div>
        <ProfileElements type="pets" user={pet?.user} same={user?.id == pet?.user} related={true} />
      </div>
    </div>
    <Footer />
    <Tooltip target=".hasTooltip" position="top" />
  </>
}

export default Pet