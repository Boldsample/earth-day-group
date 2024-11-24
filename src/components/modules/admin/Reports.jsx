import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { useDispatch, useSelector } from 'react-redux'
import { faSearch, faTrash, faPaw, faEnvelopeOpenText, faUser, faTags, faFileDownload } from '@fortawesome/free-solid-svg-icons'
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
import { getUsers } from '@services/userServices'

const Reports = () => {
	const dispatch = useDispatch()
	const [detail, setDetail] = useState({})
	const [admins, setAdmins] = useState([])
	const [reset, setReset] = useState(false)
	const [profile, setProfile] = useState(null)
	const [loading, setLoading] = useState(false)
	const [reports, setReports] = useState({data: []})
	const user = useSelector((state) => state.users.userData)
	const [page, setPage] = useState({first: 0, page: 0, rows: 6})
	const [t] = useTranslation('translation', { keyPrefix: 'admin.report' })
	const [tGlobal] = useTranslation('translation', { keyPrefix: 'global' })
	const [filters, setFilters] = useState({type: "", status: "", admin: "", keyword: ''})
	const [tSubjects] = useTranslation('translation', { keyPrefix: 'admin.reportInfo' })

	const hidePopup = reload => {
		setDetail({...detail, show: false})
		if(reload)
			callReports()
	}
	const updateFilters = (name, value, wait=false) => {
		setFilters(prev => ({...prev, [name]: value}))
		if(!wait){
			setPage({first: 0, page: 0, rows: 6})
			setReset(true)
		}
	}
	const getReportDetail = async id => {
		const _report = await getReport(id)
		setDetail({..._report, show: true})
	}
	const callReports = async (ex = false) =>{
		setLoading(true)
		let _filter = {}
		if(filters?.type != '')
			_filter['type'] = `r.type='${filters.type}'`
		if(filters?.status != '')
			_filter['status'] = `r.status='${filters.status}'`
		if(filters?.admin !== '')
			_filter['admin'] = `r.admin='${filters.admin}'`
		if(filters?.keyword != '')
			_filter['keyword'] = encodeURIComponent(`(r.subject LIKE '%${filters.keyword}%' OR r.description LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR of.material LIKE '%${filters.keyword}%' OR pr.name LIKE '%${filters.keyword}%' OR pe.name LIKE '%${filters.keyword}%' OR e.name LIKE '%${filters.keyword}%')`)
		const _reports = await getReports(_filter, page, ex)
		setLoading(false)
		if(!ex)
		  setReports(_reports)
	}
	const renderHeader = () => {
		return <div className="filters">
			<Dropdown style={{width: '10.7rem'}} value={filters?.type} onChange={e => updateFilters('type', e.value)} optionLabel="name" optionValue="value" placeholder={t('all')} options={[
				{name: t('all'), value: ""},
				{name: t('allUsers'), value: "user"},
				{name: t('allOffers'), value: "offer"},
				{name: t('allProducts'), value: "product"},
				{name: t('allPets'), value: "pet"},
			]} />
			<Dropdown style={{width: '12.1rem'}} value={filters?.status} onChange={e => updateFilters('status', e.value)} optionLabel="name" optionValue="value" placeholder={t('allStatuses')} options={[
				{name: t('allStatuses'), value: ""},
				{name: t('info'), value: "info"},
				{name: t('danger'), value: "danger"},
				{name: t('success'), value: "success"},
			]} />
			{filters?.status != 'danger' && 
				<Dropdown style={{width: '10.7rem'}} value={filters?.admin} onChange={e => updateFilters('admin', e.value)} optionLabel="name" optionValue="value" placeholder={t('allAdmins')} options={[
					{name: t('allAdmins'), value: ""},
					{name: t('unassigned'), value: 0},
					...admins?.map(({id, name}) => ({name, value: id}))
				]} />
			}
			<InputText 
				style={{width: '14rem'}} 
				value={filters?.keyword} 
				placeholder={t('inputSearchPlaceHolder')} 
				onKeyDown={(e) => e.key === 'Enter' ? callReports() : null} 
				onChange={e => updateFilters('keyword', e.target.value, e.target.value != '')} />
			<Button className="small dark-blue" type="button" onClick={callReports}>{tGlobal('search')}</Button>
			<Button className="small red-state" type="button" onClick={() => {
				setReset(true)
				setFilters({type: "", status: "", admin: "", keyword: ''})
			}}>{tGlobal('reset')}</Button>
    		<Button className="green-earth" onClick={() => callReports(true)}><FontAwesomeIcon icon={faFileDownload} /></Button>
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
	const keepFirstLetters = inputString => {
		const words = inputString.split(' ');
		const firstLetters = words.map(word => word[0]).join('');
		return firstLetters.slice(0, 2);
	}
	
	useEffect(() => {
		callReports()
		setReset(false)
	}, [page, reset])
	useEffect(() => {
		getUsers({role: `u.role='admin'`, state: `u.state=1`}, 'full').then(({data}) => setAdmins(data))
		dispatch(setHeader('user'))
	}, [])
	
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
						dataKey="id" 
						page={page.page} 
						rows={page.rows} 
						first={page.first} 
						value={reports?.data} 
						header={renderHeader} 
						totalRecords={reports?.total} 
						emptyMessage={t('noProductsFoundText')}
						onPage={({first, page, rows}) => setPage({first, page, rows})}>
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
						<Column header={t('tableTitleReported')}  field="name" body={({name, epicture}) => <>
							<Avatar className="profile__photo text-upperCase" label={keepFirstLetters(name)} style={{ backgroundColor: 'var(--orange)', color: '#ffffff' }} image={epicture} shape="circle" />
							{name}
						</>}></Column>
						<Column header={t('tableTitleStatus')}  body={({status}) => 
							<Tag value={t(status)} severity={status} />
						}></Column>
						<Column header={t('tableTitleAssignedTo')}  field="admin" body={({aid, admin})=>
							<span className='table-item__background'>{aid ? admin : t(admin) }</span>
						}></Column>
						<Column className="actions" header={null} body={({id, aid, owner }) => <>
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