import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Link } from 'react-router-dom'
import { setHeader } from '@store/slices/globalSlice'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './styles.sass'

const HeaderNotifications = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setHeader('user'))
	}, [])
	
	return <div className="header_notifications">
		<Link to={"/notifications/"}><FontAwesomeIcon icon={faBell} /></Link>
		<div className="list">
			<MultiUseCard 
				type='notification'
				title='New Notification'
				description='Green Earth Recycling sent you a new offer'
				date='11-02-2023 10:45 am'
			/>
			<MultiUseCard 
				type='notification'
				title='New Notification'
				description='Green Earth Recycling sent you a new offer'
				date='11-02-2023 10:45 am'
			/>
		</div>
	</div>
}

export default HeaderNotifications