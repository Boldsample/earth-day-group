import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { useDispatch, useSelector } from 'react-redux'
import { faSearch, faTrash, faPaw, faEnvelopeOpenText, faUser, faTags } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane} from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next'
import { Avatar } from 'primereact/avatar';
import { Tooltip } from 'primereact/tooltip';

import { Dropdown } from 'primereact/dropdown'
import { setHeader } from '@store/slices/globalSlice'
import { getReport, getReports } from '@services/reportServices'
import TableSkeleton from '@ui/skeletons/tableSkeleton/TableSkeleton'
import ReportInfo from './ReportInfo'
import { ProfileProvider } from '..'
import { Tag } from 'primereact/tag'

const Reports = () => {
	const dispatch = useDispatch()
	const [detail, setDetail] = useState({})
	const [reset, setReset] = useState(false)
	const [profile, setProfile] = useState(null)
	const [reports, setReports] = useState({data: []})
	const [page, setPage] = useState({page: 0, rows: 6})
	const user = useSelector((state) => state.users.userData)
	const [filters, setFilters] = useState({type: "", keyword: ''})
	const [t] = useTranslation('translation', { keyPrefix: 'admin.report' })
	const [tSubjects] = useTranslation('translation', { keyPrefix: 'admin.reportInfo' })
	const states = { 'In Process': 'info', 'Pending': 'danger', 'Resolved': 'success' }

	const hidePopup = reload => {
		setDetail({...detail, show: false})
		if(reload)
			callReports()
	}
	const updateFilters = (name, value) => setFilters(prev => ({...prev, [name]: value}))
	const getReportDetail = async id => {
		const _report = await getReport(id)
		setDetail({..._report, show: true})
	}
	const callReports = async () =>{
		let _filter = {}
		if(filters?.type != '')
			_filter['type'] = `r.type='${filters.type}'`
		if(filters?.keyword != '')
			_filter['keyword'] = `(r.description LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%')`
		const _reports = await getReports(_filter, page)
		setReports(_reports)
	}
	const renderHeader = () => {
		return <div className="filters">
			<Dropdown value={filters?.role} onChange={e => updateFilters('type', e.value.code)} optionLabel="name" placeholder={t('SelectInputPlaceHolder')} options={[
				{name: t('all'), code: ""},
				{name: t('allUsers'), code: "user"},
				{name: t('allOffers'), code: "offer"},
				{name: t('allProducts'), code: "product"},
				{name: t('allPets'), code: "pet"},
			]} />
			<InputText value={filters?.keyword} onChange={e => updateFilters('keyword', e.target.value)} placeholder={t('inputSearchPlaceHolder')} />
			<Button className="small dark-blue" type="button" onClick={callReports}><FontAwesomeIcon icon={faPaperPlane} /></Button>
			<Button className="small red-state" type="button" onClick={() => {
				setReset(true)
				setFilters({type: '', keyword: ''})
			}}><FontAwesomeIcon icon={faTrash} /></Button>
		</div>
	}
	
	const typeColumnBodyTemplate = (columnItem) => {
		switch (columnItem.type) {
			case 'offer':
				return <div className="flex aligncenter"><FontAwesomeIcon  color='var(--dark-blue)'  icon={faEnvelopeOpenText}/>
					<p className='ml-1 mb-0'>{columnItem.type}</p>
				</div>;
			case 'user':
				return <div className="flex aligncenter"><FontAwesomeIcon  color='var(--dark-blue)' icon={faUser}/>
					<p className='ml-1 mb-0'>{columnItem.type}</p>
				</div>;
			case 'product':
				return <div className="flex aligncenter"><FontAwesomeIcon  color='var(--dark-blue)' icon={faTags}/>
					<p className='ml-1 mb-0'>{columnItem.type}</p>
				</div>;
			case 'pet':
				return <div className="flex aligncenter"><FontAwesomeIcon  color='var(--dark-blue)' icon={faPaw}/>
					<p className='ml-1 mb-0'>{columnItem.type}</p>
				</div>;
			default:
				return null;
		}
	};
	
	function keepFirstLetters(inputString) {
		const words = inputString.split(' ');
		const firstLetters = words.map(word => word[0]).join('');
		return firstLetters;
	}
	
	useEffect(() => {
		callReports()
		setReset(false)
	}, [page, reset])
	useEffect(() => {
		dispatch(setHeader('user'))
	}, [user])
	
	return <div className="layout">
		<img className="layout__background" src="/assets/full-width.svg" />
		<div className={'main__content fullwidth'}>
			<h1 className="text-defaultCase mb-1">{t('mainTitle')}</h1>
			<ProfileProvider profile={profile} setProfile={setProfile}>
				<ReportInfo show={detail.show} report={detail} onHide={hidePopup}   />
				{typeof reports?.total == 'undefined' && reports?.data?.length == 0 && 
					<TableSkeleton />
				|| <>
					<DataTable paginator stripedRows lazy
						emptyMessage={t('noProductsFoundText')}
						dataKey="id" 
						page={page.page} 
						rows={page.rows} 
						value={reports?.data} 
						header={renderHeader} 
						totalRecords={reports?.total} 
						onPage={({page, rows}) => setPage({page, rows})}>
						<Column headerClassName='table-header-styles' header={t('tableTitleType')} field="type" bodyClassName='table-body-styles' body={typeColumnBodyTemplate}></Column>
						<Column header={t('tableTitleSubject')}  body={({subject})=> {
							return (
								<>
									<Tooltip target=".hide-cell-length" />
									<div className='hide-cell-length' data-pr-tooltip={tSubjects(subject)}>
										{tSubjects(subject)}
									</div>
								</>
							)}}></Column>
						<Column header={t('tableTitleReported')}  field="name" body={({name, epicture})=>{
							const initials = keepFirstLetters(name)
							return <div className="flex aligncenter">
								<Avatar label={initials} style={{ backgroundColor: 'var(--orange)', color: '#ffffff', width: '15%' }} image={epicture} shape="circle" />
								<p className='ml-1 mb-0 table-body-styles'>{name}</p>
							</div>;
						}}></Column>
						<Column header={t('tableTitleStatus')}  body={({id, status}) => 
							<Tag value={t(status)} severity={states[status]} />
						}></Column>
						<Column header={t('tableTitleAssignedTo')}  field="admin" body={({admin})=>{
							return <span className='table-item__background'>{admin}</span>
						}}></Column>
						<Column className="actions" header={null} body={({id, username, aid, oname, status, owner }) => <>
						{aid === user.id && (
							<Link className="button small green-earth" to={`/chat/${owner}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>
						)}
							<Button className="small dark-blue" onClick={() => getReportDetail(id)}><FontAwesomeIcon icon={faSearch} /></Button>
						</>}></Column>
					</DataTable>
				</>}
			</ProfileProvider>
		</div>
	</div>
}

export default Reports