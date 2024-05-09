import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import "./styles.sass"

const Settings = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setHeader('settings'))
		dispatch(setHeaderTitle('Settings'))
	}, [])

	return <div className="layout" style={{background: 'white'}}>
		<div className="main__content centerwidth">
			<div className="settings">
				<Link className="button" to="/settings/profile/"><i className="pi pi-user" /> My Profile <i className="pi pi-angle-right" /></Link>
				<Link className="button" to="/settings/edit/"><i className="pi pi-lock" /> Change Password <i className="pi pi-angle-right" /></Link>
				<Link className="button" to="/settings/terms/"><i className="pi pi-shield" /> Terms & Conditions <i className="pi pi-angle-right" /></Link>
				<Link className="button" to="/settings/about/"><i className="pi pi-check" /> About the App <i className="pi pi-angle-right" /></Link>
				<Link className="button" to="/settings/activity/"><i className="pi pi-shield" /> My Activity <i className="pi pi-angle-right" /></Link>
				<a className="button"><i className="pi pi-trash" /> Delete Account <i className="pi pi-angle-right" /></a>
			</div>
			<div className="fullwidth text-center mt-3">
				<button className="red-state" style={{width: '340px'}}>Log Out</button>
			</div>
		</div>
	</div>
}

export default Settings