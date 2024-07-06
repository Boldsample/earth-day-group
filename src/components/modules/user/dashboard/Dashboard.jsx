import { Link } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { useEffect, useState } from "react"
import { InputText } from "primereact/inputtext"

//import modules from "./modules"
import Card from "@ui/cards/Card"
import modules from "@json/modules"
import { setHeader } from '@store/slices/globalSlice'

import "./dashboard.sass"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

const Dashboard = () => {
	const dispatch = useDispatch()
	const [filteredModule, setFilteredModule] = useState([])
	
	const filteredModules = modules.filter((module) =>
		module.title.toLowerCase().includes(filteredModule)
	)

	useEffect(() => {
		dispatch(setHeader('dashboard'))
	}, [])

	return <div className="layout">
		<img className="layout__background" src="/assets/intro/image-3.svg" />
		<div className="main__content dashboard-content">
			<div className="edg-search mb-5">
				<h4 className="mb-1">Discover:</h4>
				<div className="fullwidth p-input-icon-left">
					<FontAwesomeIcon icon={faSearch} />
					<InputText
						placeholder="Search"
						className="p-inputtext"
						onChange={(e) => setFilteredModule(e.target.value)} />
				</div>
			</div>
			<div className="card__grid">
				{filteredModules.length > 0 ? filteredModules.map((module, key) => <Link key={key} to={module.link}>
					<Card key={key}
						icon={module.icon}
						link={module.link}
						title={module.title}
						cardStyle={module.className}
						description={module.description} />
				</Link>) : "We couldn't find what you are looking for. Care to try again."}
			</div>
		</div>
	</div>
}

export default Dashboard