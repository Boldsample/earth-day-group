import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronRight, faGear, faHeart, faList, faLock, faShieldHalved, faTrashCan, faUser, faSliders } from '@fortawesome/free-solid-svg-icons'

import { logoutUser } from '@services/userServices'
import { resetState } from '@store/slices/usersSlice'
import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import "./styles.sass"

const Settings = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.users.userData)
  const [t] = useTranslation('translation', { keyPrefix: 'settings.settings'})

  const logout = async (e) => {
    if(await logoutUser()){
      dispatch(resetState())
      navigate('/login/')
    }
  };

  useEffect(() => {
    dispatch(setHeader('settings'))
    dispatch(setHeaderTitle('settings'))
  }, [])

  return <div className="layout" style={{background: 'white'}}>
    <div className="main__content centerwidth verticalcenter-2">
      <div className="settings">
        <Link className="button outline" to="/settings/profile/"><div className="icon"><FontAwesomeIcon icon={faUser} /></div> {t('profileBtnText')} <FontAwesomeIcon icon={faChevronRight} /></Link>
        <Link className="button outline" to="/settings/password/"><div className="icon"><FontAwesomeIcon icon={faLock} /></div> {t('changePasswordBtnText')}  <FontAwesomeIcon icon={faChevronRight} /></Link>
        {(user?.role == 'user' || user?.role == 'company') && 
          <Link className="button outline" to="/bookmarks/products/saved"><div className="icon"><FontAwesomeIcon icon={faHeart} /></div> {t('bookmarksBtnText')}  <FontAwesomeIcon icon={faChevronRight} /></Link>
        }
        <Link className="button outline" to="/settings/preferences/"><div className="icon"><FontAwesomeIcon icon={faSliders} /></div> {t('preferencesBtnText')}  <FontAwesomeIcon icon={faChevronRight} /></Link>
        <Link className="button outline" to="/terms-of-service/"><div className="icon"><FontAwesomeIcon icon={faShieldHalved} /></div>{t('termsAndConditionsBtnText')}  <FontAwesomeIcon icon={faChevronRight} /></Link>
        <Link className="button outline" to="/privacy-policy/"><div className="icon"><FontAwesomeIcon icon={faCheck} /></div>{t('privacyPolicyBtnText')}<FontAwesomeIcon icon={faChevronRight} /></Link>
        <Link className="button outline" to="/settings/delete-account/"><div className="icon trash"><FontAwesomeIcon icon={faTrashCan} /></div> {t('deleteAccountBtnText')}  <FontAwesomeIcon icon={faChevronRight} /></Link>
        {/* <Link className="button outline" to="/settings/activity/"><div className="icon"><FontAwesomeIcon icon={faList} /></div> My Activity <FontAwesomeIcon icon={faChevronRight} /></Link> */}
      </div>
      <div className="fullwidth text-center mt-3">
        <button className="red-state" onClick={logout} style={{width: '21.25rem'}}>{t('logOutBtnText')} </button>
      </div>
    </div>
  </div>
}

export default Settings