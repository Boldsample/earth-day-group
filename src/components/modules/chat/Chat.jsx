import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

const Chat = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setHeader('settings'))
		dispatch(setHeaderTitle('User chat'))
	}, [])

	return <div className="layout" style={{background: 'white'}}>
		<div className="main__content centerwidth">
		</div>
	</div>
}

export default Chat