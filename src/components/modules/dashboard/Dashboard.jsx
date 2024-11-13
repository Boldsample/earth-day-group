import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next'
import { InputText } from "primereact/inputtext"
import { useDispatch, useSelector } from 'react-redux'
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "./dashboard.sass"
import Card from "@ui/cards/Card"
import modules from "@json/modules"
import AdBanner from "@ui/banners/AdBanner"
import { setHeader } from '@store/slices/globalSlice'


const Dashboard = () => {
	const dispatch = useDispatch()
	const [filteredModule, setFilteredModule] = useState([])
	const user = useSelector((state) => state.users.userData)
	const [t] = useTranslation('translation', { keyPrefix: 'dashboard' })
	const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})
	const filteredModules = modules.filter(module => {
    if(!module?.roles?.some(role => role == user?.role))
      return false
		return module?.title?.toLowerCase()?.includes(filteredModule)
	})

	useEffect(() => {
		dispatch(setHeader('dashboard'))
	}, [])

	return <div className="layout">
		<img className="layout__background" src="/assets/intro/image-3.svg" />
		<div className="main__content dashboard-content">
			<div className="edg-search mb-5">
				<h4 className="mb-1">{t('inputSearchTitle')}</h4>
				<div className="fullwidth p-input-icon-left">
					<FontAwesomeIcon icon={faSearch} />
					<InputText
						placeholder={t('inputSearchPlaceHolder')}
						className="p-inputtext"
						onChange={(e) => setFilteredModule(e.target.value)} />
				</div>
			</div>
			<div className="card__grid">
				<AdBanner type="dashboardButton" />
				{filteredModules.length > 0 ? filteredModules.map((module, key) => <Link key={key} to={module.link}>
					<Card key={key}
						icon={module.icon}
						link={module.link}
						// title={module.title}
						title={t(`${module?.title}`)}
						cardStyle={module.className}
						description={t(`${module?.description}`)} />
				</Link>) : tGlobal('notfoundErrorMessage')}
			</div>
		</div>
	</div>
}

export default Dashboard