import { Link } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { useEffect, useState } from "react"
import { InputText } from "primereact/inputtext"

//import modules from "./modules"
import Card from "@ui/cards/Card"
import modules from "@json/modules"
import { setHeader } from '@store/slices/globalSlice'

import "./dashboard.sass"

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
			<div className="category__search mb-3">
				<h4>Discover:</h4>
				<span className="p-input-icon-left">
					<i className="pi pi-search" />
					<InputText
						placeholder="Search"
						className="p-inputtext"
						onChange={(e) => setFilteredModule(e.target.value)} />
				</span>
			</div>
			<div className="card__grid">
				{filteredModules.length > 0 ? filteredModules.map((module, key) => <Link key={key} to={module.link}>
					<Card key={key}
						icon={module.icon}
						link={module.link}
						title={module.title}
						cardStyle={module.className}
						description={module.description} />
				</Link>) : "No modules found."}
			</div>
		</div>
	</div>
}

export default Dashboard