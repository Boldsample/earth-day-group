import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import "./styles.sass"

const Activity = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setHeader('settings'))
		dispatch(setHeaderTitle('My Activity'))
	}, [])

	return <div className="layout" style={{background: 'white'}}>
		<div className="main__content centerwidth">
			<div className="settings">
			</div>
		</div>
	</div>
}

export default Activity