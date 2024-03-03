import '../ui/intro.sass'
import intro1 from '../../../../assets/intro-1.svg'
import intro2 from '../../../../assets/intro-2.svg'
import intro3 from '../../../../assets/intro-3.svg'
import intro4 from '../../../../assets/intro-4.svg'
import 'primereact/resources/themes/lara-light-indigo/theme.css'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Carousel } from 'primereact/carousel'

const introItems = [
	{
		img: intro1,
		title: 'Welcome everybody to Earth Day Group',
		content: 'A Modern Solution For a Sustainable Society',
		list: [
			'Make an extra income.',
			'Locate recycling centers near you.',
			'Find social organizations.',
			'Find animal shelters.',
			'Find eco-friendly products.'
		]
	},
	{
		img: intro2,
		title: 'Locate recycling centers near you',
		content: 'According to your location EDG will indicate the nearest recycling center and the prices they offer to each type of material.'
	},
	{
		img: intro3,
		title: 'Help your planet and your pocket',
		content: 'Make an extra income with your recycling, you can choose who to sell or buy depending on your interest.'
	},
	{
		img: intro4,
		classes: 'h2',
		title: 'Find social organization',
		content: 'Give a second change to those objects that you think can help someone else.'
	}
]
const Intro = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const IntroTemplate = (item) => {
		return <div className="intro">
			<img className="background" src={item?.img} />
			<div className="content">
				<h1 className={item?.classes}>{item?.title}</h1>
				<p>{item?.content}</p>
				{item?.list ? <ul>{item.list.map((i, key) => <li key={key}>{i}</li>)}</ul> : null}
				<div>
					{activeIndex + 1 < introItems.length ? <>
						<Link className="button" to="/login/">Skip <span className="material-icons">skip_next</span></Link>
						<button onClick={() => setActiveIndex((prevIndex) => (prevIndex + 1) % introItems.length)} className="secondary">Next <span className="material-icons">chevron_right</span></button>
					</> : <Link className="button secondary" to="/login/">Next <span className="material-icons">chevron_right</span></Link>}
				</div>
			</div>
		</div>
	}

	return <div id="intro">
		<Carousel value={introItems} numVisible={1} numScroll={1} itemTemplate={IntroTemplate} onPageChange={(e) => setActiveIndex(e.page)} page={activeIndex} />
	</div>
}
export default Intro