import { Link } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { useEffect, useState } from "react"
import { InputText } from "primereact/inputtext"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { getUsers } from "@services/userServices"
import { setHeader } from '@store/slices/globalSlice'

import "./styles.sass"
import Footer from "@ui/footer/Footer"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"

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

	console.log(companies)
	const secondaryBannerData = [
		{
			"title": "100%\nRecycled",
			"icon": "/assets/icons/recycleCompanyIcon1.svg",
		},
		{
			"title": "Eco\nFriendly",
			"icon": "/assets/icons/recycleCompanyIcon2.svg",
		},
		{
			"title": "Post\nOffer",
			"icon": "/assets/icons/recycleCompanyIcon3.svg",
		},
	]

	return <div className="layout">
    <div className="companies__banner">
      <h1 className="text-upperCase">Help the planet and help your pocket!!</h1>
    </div>
	<div className="secondary__banner">
		{secondaryBannerData.map(data =>{
			return<div className="icon__container">
					<img src={data.icon} alt={data.title} />
					<h3>{data.title}</h3>
				</div>	
		})}
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
			<div className="recycleCompaniesCards__grid">
				{companies.map((company) =>{
					return <div className="recycleCompanyCard__container">
							<ProfilePhoto 
							className="recycleCompanyProfile__photo"
							userPhoto={company.picture}
							size="35px"
							/>
						<div className="contactInformation__container">
							<small>2,3miles</small>
							<h4>{company.name}</h4>
							<p>{company.address}</p>
						</div>
				</div>
				})}
				
			</div>
		</div>
		<Footer/>
	</div>
}

export default Companies