import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setHeader } from '@store/slices/globalSlice'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'

const Notifications = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setHeader('user'))
	}, [])
	
	return <div className="layout">
		<img className="layout__background" src="/assets/user/image-5.svg" />
		<div className="main__content">
			<h4 className='text-defaultCase'>Notifications</h4>
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

export default Notifications