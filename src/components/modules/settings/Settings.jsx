import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronRight, faList, faLock, faShieldHalved, faTrashCan, faUser } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

import { logoutUser } from '@services/userServices'
import { resetState } from '@store/slices/usersSlice'
import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import "./styles.sass"

const Settings = () => {
	const dispatch = useDispatch()
  const navigate = useNavigate()
  const [t] = useTranslation('translation', { keyPrefix: 'settings.settings'})

  const logout = async (e) => {
    if(await logoutUser()){
      dispatch(resetState())
      navigate('/login/')
    }
  };

	useEffect(() => {
		dispatch(setHeader('settings'))
		dispatch(setHeaderTitle('Settings'))
	}, [])

	return <div className="layout" style={{background: 'white'}}>
		<div className="main__content centerwidth verticalcenter-2">
			<div className="settings">
				<Link className="button outline" to="/settings/profile/"><div className="icon"><FontAwesomeIcon icon={faUser} /></div> {t('profileBtnText')} <FontAwesomeIcon icon={faChevronRight} /></Link>
				<Link className="button outline" to="/settings/password/"><div className="icon"><FontAwesomeIcon icon={faLock} /></div> {t('changePasswordBtnText')}  <FontAwesomeIcon icon={faChevronRight} /></Link>
				<Link className="button outline" to="/settings/terms/"><div className="icon"><FontAwesomeIcon icon={faShieldHalved} /></div>{t('termsAndConditionsBtnText')}  <FontAwesomeIcon icon={faChevronRight} /></Link>
				<Link className="button outline" to="/settings/privacy-policy/"><div className="icon"><FontAwesomeIcon icon={faCheck} /></div>{t('privacyPolicyBtnText')}<FontAwesomeIcon icon={faChevronRight} /></Link>
				<Link className="button outline" to="/settings/deleteAccount/"><div className="icon trash"><FontAwesomeIcon icon={faTrashCan} /></div> {t('deleteAccountBtnText')}  <FontAwesomeIcon icon={faChevronRight} /></Link>
				{/* <Link className="button outline" to="/settings/activity/"><div className="icon"><FontAwesomeIcon icon={faList} /></div> My Activity <FontAwesomeIcon icon={faChevronRight} /></Link> */}
			</div>
			<div className="fullwidth text-center mt-3">
				<button className="red-state" onClick={logout} style={{width: '21.25rem'}}>{t('logOutBtnText')} </button>
			</div>
		</div>
	</div>
}

export default Settings