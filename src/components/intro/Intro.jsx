import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Carousel } from 'primereact/carousel'

import introItems from '@json/intro.json'

const Intro = () => {
	const [activeIndex, setActiveIndex] = useState(0)
	const IntroTemplate = (item) => {
		return <div className="layout">
			<img className="layout__background" src={item?.img} />
			<div className="main__content">
				<h1 className={'text-upperCase mb-1 '+item?.classes}>{item?.title}</h1>
				<p className="mb-1">{item?.content}</p>
				{item?.list ? <ul className='mb-1'>{item.list.map((i, key) => <li key={key}>{i}</li>)}</ul> : null}
				<div>
					{activeIndex + 1 < introItems.length ? <>
						<Link className="button" to="/login/">Skip <span className="material-icons">skip_next</span></Link>
						<button onClick={() => setActiveIndex((prevIndex) => (prevIndex + 1) % introItems.length)} className="dark-blue">Next <span className="material-icons">chevron_right</span></button>
					</> : <Link className="button dark-blue" to="/login/">Next <span className="material-icons">chevron_right</span></Link>}
				</div>
			</div>
		</div>
	}

	return <div id="intro">
		<Carousel value={introItems} numVisible={1} numScroll={1} itemTemplate={IntroTemplate} onPageChange={(e) => setActiveIndex(e.page)} page={activeIndex} />
	</div>
}
export default Intro