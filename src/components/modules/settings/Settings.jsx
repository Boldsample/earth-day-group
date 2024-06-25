import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronRight, faList, faLock, faShieldHalved, faTrashCan, faUser } from '@fortawesome/free-solid-svg-icons'

import { logoutUser } from '@services/userServices'
import { resetState } from '@store/slices/usersSlice'
import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import "./styles.sass"

const Settings = () => {
	const dispatch = useDispatch()
  const navigate = useNavigate()

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
				<Link className="button outline" to="/settings/profile/"><div className="icon"><FontAwesomeIcon icon={faUser} /></div> My Profile <FontAwesomeIcon icon={faChevronRight} /></Link>
				<Link className="button outline" to="/settings/password/"><div className="icon"><FontAwesomeIcon icon={faLock} /></div> Change Password <FontAwesomeIcon icon={faChevronRight} /></Link>
				<Link className="button outline" to="/settings/terms/"><div className="icon"><FontAwesomeIcon icon={faShieldHalved} /></div> Terms & Conditions <FontAwesomeIcon icon={faChevronRight} /></Link>
				<Link className="button outline" to="/settings/about/"><div className="icon"><FontAwesomeIcon icon={faCheck} /></div> About the App <FontAwesomeIcon icon={faChevronRight} /></Link>
				<Link className="button outline" to="/settings/activity/"><div className="icon"><FontAwesomeIcon icon={faList} /></div> My Activity <FontAwesomeIcon icon={faChevronRight} /></Link>
				<a className="button outline"><div className="icon trash"><FontAwesomeIcon icon={faTrashCan} /></div> Delete Account <FontAwesomeIcon icon={faChevronRight} /></a>
			</div>
			<div className="fullwidth text-center mt-3">
				<button className="red-state" onClick={logout} style={{width: '21.25rem'}}>Log Out</button>
			</div>
		</div>
	</div>
}

export default Settings