import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { faPhone, faLocationDot, faHouse, faGlobe, faPen, faHeart, faEnvelope, faPlus, faVenusMars, faPaw, faSignal, faWeightScale, faFlag } from "@fortawesome/free-solid-svg-icons"
import { useTranslation } from 'react-i18next'

import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import RecycleMaterialCard from '@ui/cards/recycleMaterialCard/RecycleMaterialCard'

import './profile.sass'
import { Tooltip } from 'primereact/tooltip'

const ProfileInformation = ({profile, same, doFollow, admin}) => {
	const [tMaterial] = useTranslation('translation', { keyPrefix: 'material'})
	const [t] = useTranslation('translation', { keyPrefix: 'profile.profileInformation'})

  return <div className='profileInformation__grid'>
    <div className="image__container">
      <ProfilePhoto className="profile__photo-large" size="12.5rem" userPhoto={profile?.picture}/>
    </div>
    <div className="profileInformation__container">
      <h2>{profile?.name} {profile?.type ? `(${profile?.type})`: ''}</h2>
      <p className="mt-2 mb-4">{profile?.description}</p>
      <ul className="contact__grid">
        {profile?.email && 
          <li><FontAwesomeIcon icon={faPhone} className='contact__icon'/>{profile?.phone}</li>
        }
        {profile?.email && 
          <li><FontAwesomeIcon icon={faEnvelope}  className='contact__icon'/>{profile?.email}</li>
        }
        {profile?.website && 
          <li><FontAwesomeIcon icon={faGlobe}  className='contact__icon'/>{profile?.website}</li>
        }
        {profile?.role == 'company' && 
          <li><FontAwesomeIcon icon={faHouse}  className='contact__icon'/> {t('pickUpFromHomeText')} {profile?.pick_up_from_home == true ? t('pickUpAvailable') : t('pickUNotpAvailable')}</li>
        }
      </ul>
      {profile?.materials?.length > 0 && 
        <div className="recycableGoods__container"> 
          <h4>{t('recyclableGoodsTitle')}</h4>
          <div className='materialsCard__grid'>
            {profile?.materials?.map((material) => 
              <RecycleMaterialCard
                key={material.id}
                material={tMaterial(material.type)}
                unit={material.unit}
                price={material.price}
                color={material.color} />
            )}
          </div>
        </div>
      }
      <div className="buttons__container">
        {!same && 
          <Link className="button small green-earth" to={`/chat/${profile?.username}/`}><FontAwesomeIcon icon={faPaperPlane} /> <span>{t('contactBtnText')}</span></Link>
        }
        {same && <>
          <Link className="button small dark-blue" to="/settings/edit/"><FontAwesomeIcon icon={faPen} /> <span>{t('editProfileBtnText')}</span></Link>
          {(profile?.role == 'vendor' || profile?.role == 'social' || profile?.role == 'ngo') && 
            <Link className="button small blue-earth self-end" to="/product/new/"><FontAwesomeIcon icon={faPlus} /> {t('newProductBtnText')}</Link>
          }
          {(profile?.role == 'shelter' || profile?.role == 'ngo') && 
            <Link className="button small green-earth self-end" to="/pet/new/"><FontAwesomeIcon icon={faPlus} /> {t('newPetBtnText')}</Link>
          }
        </> || <>
          <Button className={'small '+(profile?.followed ? 'red-state' : 'dark-blue')} onClick={() => doFollow(profile?.id)}><FontAwesomeIcon icon={faHeart} /> <span>{profile?.followed ? t('unFollowBtn') : t('followBtn')}</span></Button>
          <Link className="button small dark-blue outline" to={`/map/${profile?.username}/`}><FontAwesomeIcon icon={faLocationDot} /> <span>{t('viewLocationBtnText')}</span></Link>
          {!admin && 
            <Link className="button small red-state outline hasTooltip" to={`/report/user/${profile?.username}/`} data-pr-tooltip={t('reportUserToolTip')}><FontAwesomeIcon icon={faFlag} /></Link>
          }
        </>}
      </div>
    </div>
    <Tooltip target=".hasTooltip" position="top" />
  </div>
}

export default ProfileInformation