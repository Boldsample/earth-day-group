import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Carousel } from 'primereact/carousel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faRightToBracket } from '@fortawesome/free-solid-svg-icons'

import introItems from '@json/intro.json'
import { setHeader } from '@store/slices/globalSlice'

const Intro = () => {
	const dispatch = useDispatch()
	const [activeIndex, setActiveIndex] = useState(0)

	useEffect(() => {
		dispatch(setHeader('intro'))
	}, [])

	const IntroTemplate = (item) => {
		return <div className="layout">
			<img className="layout__background" src={item?.img} />
			<div className="main__content">
				<h1 className={'text-upperCase mb-1 '+item?.classes}>{item?.title}</h1>
				<p className="mb-1">{item?.content}</p>
				{item?.list ? <ul className='mb-1'>{item.list.map((i, key) => <li key={key}>{i}</li>)}</ul> : null}
				<div>
					{activeIndex + 1 < introItems.length ? <>
						<Link className="button" to="/register/">Skip <FontAwesomeIcon icon={faRightToBracket} /></Link>
						<button onClick={() => setActiveIndex((prevIndex) => (prevIndex + 1) % introItems.length)} className="dark-blue">Next <FontAwesomeIcon icon={faChevronRight} /></button>
					</> : <Link className="button dark-blue" to="/register/">Next <FontAwesomeIcon icon={faChevronRight} /></Link>}
				</div>
			</div>
		</div>
	}

	return <div id="intro">
		<Carousel value={introItems} numVisible={1} numScroll={1} itemTemplate={IntroTemplate} onPageChange={(e) => setActiveIndex(e.page)} page={activeIndex} />
	</div>
}
export default Intro