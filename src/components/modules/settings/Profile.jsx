import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { useDispatch, useSelector } from 'react-redux'

import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import "./styles.sass"

const ProfileSettings = () => {
	const dispatch = useDispatch()
	const user = useSelector((state) => state.users.userData)

	useEffect(() => {
		dispatch(setHeader('settings'))
		dispatch(setHeaderTitle('Profile'))
	}, [])

	return <div className="layout" style={{background: 'white'}}>
		<div className="main__content centerwidth alignttop text-center">
			<div className="settings__card">
				<ProfilePhoto className="mb-1" userPhoto={user.picture} />
				<h4 className="font-bold text-gray">{user.name}</h4>
				<p>{user.email}</p>
				{user.pick_up_from_home && <h5 className="font-bold mb-1">Pick at Home</h5>}
				<p className="small mb-1">{user.description}</p>
				<Link to={`/company/${user.id}`} className="button dark-blue">Learn more</Link>
			</div>
			<div className="settings__card">
				<DataTable value={[
					{ key: 'Phone Number', value: user.phone },
					{ key: 'Address', value: user.address }
				]} tableStyle={{ minWidth: '50rem' }}>
					<Column field="key" header="Code"></Column>
					<Column field="value" header="Name"></Column>
				</DataTable>
			</div>
		</div>
	</div>
}

export default ProfileSettings