import { Link } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { useEffect, useState } from "react"
import { InputText } from "primereact/inputtext"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { getUsers } from "@services/userServices"
import { setHeader } from '@store/slices/globalSlice'

import "./styles.sass"

const Companies = () => {
	const dispatch = useDispatch()
	const [companies, setCompanies] = useState([])
	
	const loadCompanies = async (filter = {role: 'company'}) => {
		let _companies = await getUsers(filter)
		setCompanies(_companies)
	}

	useEffect(() => {
		loadCompanies()
		dispatch(setHeader('user'))
	}, [])

	return <div className="layout">
    <div className="companies__banner">
      <h1 className="text-upperCase">Help the planet and help your pocket!!</h1>
    </div>
		<div className="main__content dashboard-content fullwidth">
			<div className="search mb-3">
				<span className="p-input-icon-left">
					<FontAwesomeIcon icon={faSearch} />
					<InputText
						placeholder="Search"
						className="p-inputtext"
						onChange={(e) => loadCompanies({role: 'company', name: e.target.value})} />
				</span>
			</div>
		</div>
	</div>
}

export default Companies