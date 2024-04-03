import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

import "./registerThankYouPage.sass"

const ThankYouPage = () => {
	const { title, content, link, button_label, background } = useSelector((state) => state.global.thankyou)

	return <div className="layout">
		<img className="layout__background" src={'/assets/thankyou/image-1.svg'} />
		<div className="main__content fullviewportwidth text-center">
			<div className="inline-block" style={{width: '500px'}}>
				<h1 className="text-upperCase mb-2">{title}</h1>
				<p className="mb-2">{content}</p>
				<p><Link className="button dark-blue fullwidth" to={link}>{button_label}</Link></p>
			</div>
		</div>
	</div>
}

export default ThankYouPage