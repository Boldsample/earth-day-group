import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

import OfferInfo from '@modules/offers/OfferInfo'
import { setHeader } from '@store/slices/globalSlice'
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import { getOffer, getOffers } from '@services/offersServices'
import TableSkeleton from '@ui/skeletons/tableSkeleton/TableSkeleton'

import './style.sass'

const Offers = ({type}) => {
	const dispatch = useDispatch()
	const [detail, setDetail] = useState({})
	const [reset, setReset] = useState(false)
	const [offers, setOffers] = useState({data: []})
	const [page, setPage] = useState({page: 0, rows: 6})
	const [expandedRows, setExpandedRows] = useState({})
	const user = useSelector((state) => state.users.userData)
	const [filters, setFilters] = useState({keyword: '', materials: []})
	const [t] = useTranslation('translation', { keyPrefix: 'offers.offersList' })
	const [tMaterial] = useTranslation('translation', { keyPrefix: 'materials' })

	const hidePopup = () => setDetail({...detail, show: false})
	const updateFilters = (name, value) => setFilters(prev => ({...prev, [name]: value}))
	const getUserDetail = async id => {
		const _offer = await getOffer(id)
		setDetail({..._offer, show: true})
	}
	const callOffers = async () =>{
		let _filter = {}
		if(type != 'search')
		_filter['user'] = `o.user=${user?.id}`
		if(filters?.keyword != '')
		_filter['keyword'] = `(o.title LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%')`
		if(filters?.materials?.length > 0){
		_filter['materials'] = "(o.material='" + filters.materials?.join("' OR o.material='") +"')"
		}else if(type == 'search'){
		let _materials = user?.materials?.map(material => material.type)
		if(_materials?.length > 0)
			_filter['materials'] = "(o.material='" + _materials.join("' OR o.material='") +"')"
		else
			return setOffers({total: 0, data: []})
		}
		let _offers = await getOffers(_filter, page)
		_offers.materials = _offers.materials.map(({material}) => ({label: tMaterial(material), value: material}));
		setOffers(_offers)
	}
	const renderHeader = () => {
		return <div className="filters">
			<Link to={'/offers/' + (type != 'search' ? 'search/' : '')} style={{margin: '0 auto 0 0'}}>{type != 'search' ? t('mainTitle') : t('ownerTitle')}</Link>
			<MultiSelect value={filters?.materials} maxSelectedLabels={1} onChange={(e) => updateFilters('materials', e.value)} options={offers?.materials} optionLabel="label" placeholder={t('selectInputPlaceHolder')} />
			<InputText value={filters?.keyword} onChange={e => updateFilters('keyword', e.target.value)} placeholder={t('inputSearchPlaceHolder')} />
			<Button className="small dark-blue" type="button" onClick={callOffers}><FontAwesomeIcon icon={faPaperPlane} /></Button>
			<Button className="small red-state" type="button" onClick={() => {
				setReset(true)
				setFilters({keyword: '', materials: []})
			}}><FontAwesomeIcon icon={faTrash} /></Button>
			{type != 'search' && 
				<Link className="button small green-earth" to="/offers/new/"><FontAwesomeIcon icon={faPlus} /> {t('newOfferBtn')}</Link>
			}
		</div>
	}
	const rowExpansionTemplate = data => <div className="p-3">
		<DataTable value={data.offers}>
			<Column header="" body={() => "-"} field="id" className="text-center" style={{width: '2.5rem'}}></Column>
			<Column header={t('rowExpansionCompanyTitle')} body={({name, picture}) => <><ProfilePhoto userPhoto={picture} /><b>{name}</b></>}></Column>
			<Column header={t('rowExpansionBidTitle')} body={({price}) => parseInt(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
			<Column header={t('rowExpansionStatusTitle')} body={({id, rejected, accepted}) => (rejected || (accepted != 0 && accepted != id)) && 
				<span className="text-red-state">{t('statusRejectedText')}</span> || (accepted == id && 
				<span className="text-green-state">{t('statusAprovedText')}</span>) || 
				<span>{t('statusPendingText')}</span>}>
			</Column>
			<Column header={t('rowExpansionBiddingDateTitle')} body={({date}) => date.split(' ')[0]}></Column>
			<Column className="actions" header={null} body={offer => 
			<Link className="button small green-earth" to={`/chat/${offer.username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>}></Column>
		</DataTable>
	</div>

	useEffect(() => {
		callOffers()
		setReset(false)
	}, [page, reset])
	useEffect(() => {
		dispatch(setHeader('user'))
	}, [user])
	
	return <div className="layout">
		<img className="layout__background" src="/assets/full-width.svg" />
		<div className={'main__content fullwidth ' + (type != 'search' ? 'useroffers' : '')}>
			<h1 className="text-defaultCase mb-1">{type == 'search' ? t('mainTitle') : t('ownerTitle')}</h1>
			<OfferInfo type={type != 'search' ? 'min' : 'full'} show={detail.show} offer={detail} onHide={hidePopup}  />
			{typeof offers?.total == 'undefined' && offers?.data?.length == 0 && 
				<TableSkeleton/>
			|| 
				<DataTable paginator stripedRows lazy
					emptyMessage={t('noOffersFoundText')}
					dataKey="id" 
					page={page.page}
					rows={page.rows} 
					value={offers?.data} 
					header={renderHeader}
					expandedRows={expandedRows} 
					totalRecords={offers?.total} 
					onRowToggle={e => setExpandedRows(e.data)}
					rowExpansionTemplate={rowExpansionTemplate}
					onPage={({page, rows}) => setPage({page, rows})}>
					{type != 'search' && 
						<Column  expander={({offers}) => offers?.length > 0 } style={{width: "2.5rem"}} /> || null}
					{type == 'search' && 
						<Column header="User" body={({name, picture}) => 
							<><ProfilePhoto userPhoto={picture} /> {name}</>}>
						</Column>
					}
					<Column header={t('tableColumnTitle')} field="title"></Column>
					<Column header={t('tableColumnMaterialTitle')} body={({material}) => 
						<Button label={tMaterial(material)} className={'small ' + material} />}>
					</Column>
					<Column header={t('tableColumnQuantityTitle')} body={({quantity, unit}) => quantity + ' ' + unit}></Column>
					<Column header={t('tableColumnSellPriceTitle')} body={({price}) => 
						<span className='price__background'>{parseInt(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>}>
					</Column>
					{type != 'search' && 
						<Column header={t('tableColumnOffersTitle')} body={({offers}) => offers?.length || 0}></Column>
					|| null}
					<Column header={t('tableColumnPublishedDateTitle')} body={({date}) => date.split(' ')[0]}></Column>
					{type != 'search' && 
						<Column className="actions" header={null} body={offer => 
							<Button className="small dark-blue" onClick={() => getUserDetail(offer?.id)}><FontAwesomeIcon icon={faSearch} /></Button>}>
						</Column> || 
						<Column className="actions" header={null} body={offer => <>
							<Button className="small dark-blue" onClick={() => getUserDetail(offer?.id)}><FontAwesomeIcon icon={faSearch} /></Button>
							{offer.status == 0 && 
								<Link className="button small green-earth" to={`/chat/${offer.username}/${offer.id}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link> || 
								<Link className="button small green-earth" to={`/chat/${offer.username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>
							}
						</> || null}></Column>
					}
				</DataTable>       
			}
		</div>
	</div>
}

export default Offers