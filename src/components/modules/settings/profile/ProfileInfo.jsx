import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { faFlag, faHeart as faHeartFull, faKey, faPencil, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next'

import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import { formatExternalURL } from '@utils/formatExternalURL'
import RecycleMaterialCard from '@ui/cards/recycleMaterialCard/RecycleMaterialCard'

import "../styles.sass"
import { Tooltip } from 'primereact/tooltip'
import { recoverUser } from '@services/userServices'
import { useDispatch } from 'react-redux'
import { updateThankyou } from '@store/slices/globalSlice'

const ProfileInfo = ({user, doFollow = () => false, same = false, type = 'settings', admin}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [tMaterial] = useTranslation('translation', { keyPrefix: 'material'})
  const [t] = useTranslation('translation', { keyPrefix: 'settings.profile.profileInfo'})

  const sendRecover = async () => {
    const response = await recoverUser({email: user?.email})
    if(response?.id){
      dispatch(updateThankyou({
        title: "Email sent successfully!",
        link: `/${user?.role == 'admin' ? 'admins' : 'users'}/`,
        background: "image-1.svg",
        button_label: "Go back to the list of users",
        content: `We sent a recover email to ${user?.email}!`,
      }))
      navigate('/thankyou/')
    }
  }
  const userData = () => {
    switch (user?.role) {
      case 'company':
        return [
          { key: t('userPhoneNumberTitle'), value: user?.phone },
          { key: t('userNitTitle'), value: user?.nit },
          { key: t('userWebsiteTitle'), value: <a href={formatExternalURL(user?.website)} target="_blank">{user?.website}</a> },
          { key: t('userAddressTitle'), value: user?.address }
        ]
      case 'admin':
        return [
          { key: t('userPhoneNumberTitle'), value: user?.phone },
        ]
      default:
        return [
          { key: t('userPhoneNumberTitle'), value: user?.phone },
          { key:  t('userAddressTitle'), value: user?.address }
        ]
    }
  }
  
  return <>
    <div className="settings__card">
      <div className="mb-4">
        <ProfilePhoto className="mb-1" userPhoto={user?.picture} />
        <h4 className="font-bold text-gray">{user?.name}</h4>
        <p>{user?.email}</p>
        {user?.role == 'user' && <p className="mb-2">{user?.description}</p>}
      </div>
      {same && !admin && <>
        <div className="followers">
          <Link to="/followers/">
            <span>{user?.followers}</span>
            {t('followersBtnText')}
          </Link>
          <Link to="/following/">
            <span>{user?.following}</span>
            {t('followingBtnText')}
          </Link>
        </div>
        <Link to={'/settings/edit/'} className="button small dark-blue">{t('editBtnText')}</Link>
      </> || <>
        {!admin && 
          <Button className="small red-state outline" onClick={doFollow}><FontAwesomeIcon icon={user?.followed ? faHeartFull : faHeart} /></Button>
        }
        {user?.role != 'user' && user?.role != 'admin' && 
          <Link className="button small dark-blue" to={`/${user?.role}/${user?.username}/`}><FontAwesomeIcon icon={faUser} /> <span>{t('viewProfileBtnText')}</span></Link>
        }
        {!same && type != 'chat' && (admin && user?.role != 'admin') && 
          <Link to={`/chat/${user?.username}/`} className="button small green-earth"><FontAwesomeIcon icon={faPaperPlane} /> <span>{t('sendMessageBtnText')}</span></Link>
        }
        {admin && !same && <>
          <Link to={`/${user?.role}/edit/${user?.username}/`} className="button small dark-blue outline"><FontAwesomeIcon icon={faPencil} /> <span>{t('adminEditBtnText')}</span></Link>
          <Button className="small green-earth outline" onClick={sendRecover}><span><FontAwesomeIcon icon={faKey} /></span> {t('adminRecoverBtnText')}</Button>
        </>}
        {!same && !admin && 
          <Link className="button small red-state outline hasTooltip" to={`/report/${user?.role}/${user?.username}/`} data-pr-tooltip={t('reportUserBtnText')}><FontAwesomeIcon icon={faFlag} /></Link>
        }
      </>}
    </div>
    {(same || user?.role == 'company') && 
      <div className="settings__card">
        {userData().map((data, key) => <div key={key} className="settings__table">
          <h4 className="internal">{data.key}</h4>
          <p>{data.value}</p>
        </div>)}
      </div>
    }
    {user?.role == 'company' && <>
      <div className="settings__card">
        <h4 className="internal mb-1">{t('companyInformationTitle')}</h4>
        <p className="small mb-1">{user?.description}</p>
      </div>
      <div className="settings__card">
        <div className="settings__table">
          <h4 className="internal">{t('companyPickUpAtHomeTitle')}</h4>
          <p>{user?.pick_up_from_home ? t('pickUpAvailable') : t('pickUpNotAvailable')}</p>
        </div>
        {user?.images?.length > 0 && <>
          <h4 className="internal text-left">{t('companyGalleryTitle')}</h4>
          <div className="gallery mb-2">
            {user.images.map(image => 
              <img key={image.id} src={image.picture} />
            )}
          </div>
        </>}
        {user?.materials?.length > 0 && <>
          <h4 className="internal text-left">{t('companyMaterialPriceTitle')}</h4>
          <div className="materials">
            {user.materials.map(material => 
              <RecycleMaterialCard
                key={material.id}
                material={tMaterial(material.type)}
                unit={material.unit}
                price={material.price}
                color={material.color} />
            )}
          </div>
        </>}
      </div>
    </>}
    <Tooltip target=".hasTooltip" position="top" />
  </>
}
export default ProfileInfo