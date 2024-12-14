import { Link } from "react-router-dom"
import { useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from 'react-i18next'
import { Message } from "primereact/message"

import Footer from "@ui/footer/Footer"
import { getPet, updatePet } from "@services/petServices"
import { setHeader } from "@store/slices/globalSlice"

import "../../profile/profile.sass"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import { faBookmark, faCartPlus, faFlag, faPaw, faSignal, faTrash, faVenusMars, faWeightScale, faHeart } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import PhotoGallery from "@components/modules/profile/PhotoGallery"
import ProfileElements from "@ui/templates/ProfileListing/ProfileElements"
import { faBookmark as faBookmarkLine, faPaperPlane, faHeart as faHeartLine } from "@fortawesome/free-regular-svg-icons"
import { Tooltip } from "primereact/tooltip"
import { Chip } from "primereact/chip"
import ConfirmationModal from "@ui/modals/ConfirmationModal"

const Pet = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [ pet, setPet ] = useState(null)
  const [ confirm, setConfirm ] = useState(null)
  const user = useSelector((state) => state.users.userData)
  const [tGlobal] = useTranslation('translation', { keyPrefix: 'global'})
  const [t] = useTranslation('translation', { keyPrefix: 'ngo.pets.pet' })


  const changeState = async action => {
	setConfirm(false)
	if(action){
		await updatePet({state: 2}, {id: id})
		if(user.role != 'admin')
			navigate('/profile/')
		else
			setPet(null)
	}
  }
  const doFollow = async e => {
    e.preventDefault()
    await followPet({type: 'pets', entity: id, follower: user?.id})
    getPetData()
  }
  const getPetData = async () => {
    const _pet = await getPet(id)
    if(user?.role != 'admin' && _pet?.state == 2)
      navigate('/profile/')
    else
      setPet(_pet)
  }

  useEffect(() => {
    setPet(null)
	  dispatch(setHeader('user'))
  }, [id])
  useEffect(() => {
    if(id && pet == null)
      getPetData()
  }, [pet])
  
  return <>
    <ConfirmationModal title={user?.role == "admin" ? t('disablePetTitle') : t('deletePetTitle')} visible={confirm} action={changeState} type={user?.role} />
    <div className="layout hasfooter">
      <img className="layout__background hide__mobile" src="/assets/full-width.svg" />
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
              <li><FontAwesomeIcon icon={faSignal}  className='contact__icon'/>{pet?.age} {t('petYearsOld')}</li>
              <li><FontAwesomeIcon icon={faWeightScale}  className='contact__icon'/>{pet?.weight} Kg</li>
            </ul>
            {user?.id != pet?.user && user?.role != 'admin' && <>
              <Link className="button small dark-blue" onClick={doFollow}><FontAwesomeIcon icon={pet?.followed ? faHeart : faHeartLine} /></Link>
              <Link to={`/chat/${pet?.username}/adopt/${pet?.id}/${pet?.name}`} className="button small green-earth"><FontAwesomeIcon icon={faPaperPlane} /> <span>{t('contactShelterBtn')}</span></Link>
              <Link className="button small red-state outline hasTooltip" to={`/report/pet/${pet?.id}/`} data-pr-tooltip="Report pet"><FontAwesomeIcon icon={faFlag} /></Link>
            </> || <>
              <Link to={`/pet/edit/${pet?.id}/`} className="button small dark-blue"><FontAwesomeIcon icon={faCartPlus} /> <span>{t('editPetBtn')}</span></Link>
              {pet?.state == 1 && 
                <button onClick={() => setConfirm(true)} className="button small red-state"><FontAwesomeIcon icon={faTrash} /> <span>{user?.role == "admin" ? t('disablePetBtn') : t('deletePetBtn')}</span></button>
              || 
                <div className="mt-2">
                  <Message severity="error" text={t('deletedPetWarningMessage')} />
                </div>
              }
            </>}
          </div>
        </div>
        {user?.role != 'admin' && 
          <ProfileElements type="pets" entity={pet?.id} user={pet?.user} same={user?.id == pet?.user} related={true} />
        }
      </div>
    </div>
    <Footer />
    <Tooltip target=".hasTooltip" position="top" />
  </>
}

export default Pet