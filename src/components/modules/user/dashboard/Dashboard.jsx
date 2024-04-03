import { useState } from "react"
import { Link } from "react-router-dom"
import { InputText } from "primereact/inputtext"

//import modules from "./modules"
import modules from "@json/modules"
import Card from "@ui/cards/Card"

import "./dashboard.sass"

const Dashboard = () => {
	const [filteredModule, setFilteredModule] = useState([])
	
	const filteredModules = modules.filter((module) =>
		module.title.toLowerCase().includes(filteredModule)
	)

	return <div className="layout">
		<img className="layout__background" src="/assets/intro/image-3.svg" />
		<div className="main__content dashboard">
			<div className="category__search">
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