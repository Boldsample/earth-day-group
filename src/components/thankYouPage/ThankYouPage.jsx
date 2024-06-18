import { useEffect } from 'react'
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import "./ThankYouPage.sass"
import { setHeader } from '@store/slices/globalSlice'

const ThankYouPage = () => {
	const dispatch = useDispatch()
	const { title, content, link, button_label, background } = useSelector((state) => state.global.thankyou)

	useEffect(() => {
		dispatch(setHeader('thankyou'))
	}, [])

	return <div className="layout">
		<img className="layout__background" src={'/assets/thankyou/image-1.svg'} />
		<div className="main__content centerwidth verticalcenter-2 text-center">
			<div className="inline-block" style={{width: '500rem'}}>
				<h1 className="text-upperCase mb-2">{title}</h1>
				<p className="mb-2">{content}</p>
				<p><Link className="button dark-blue fullwidth" to={link}>{button_label}</Link></p>
			</div>
		</div>
	</div>
}

export default ThankYouPage