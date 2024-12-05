import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'
import { useDispatch, useSelector } from 'react-redux'
import { faFileDownload, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { Tooltip } from 'primereact/tooltip'

import OfferInfo from '@modules/offers/OfferInfo'
import { setHeader } from '@store/slices/globalSlice'
import materials from "@json/recyclableMaterials.json"
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import { getOffer, getOffers } from '@services/offersServices'
import TableSkeleton from '@ui/skeletons/tableSkeleton/TableSkeleton'

const AdminOffers = () => {
  const dispatch = useDispatch()
  const [detail, setDetail] = useState({})
  const [reset, setReset] = useState(false)
  const [offers, setOffers] = useState({data: []})
  const [expandedRows, setExpandedRows] = useState({})
  const user = useSelector((state) => state.users.userData)
  const [page, setPage] = useState({first: 0, page: 0, rows: 6})
  const [filters, setFilters] = useState({keyword: '', materials: []})
  const [tGlobal] = useTranslation('translation', { keyPrefix: 'global' })
  const [t] = useTranslation('translation', { keyPrefix: 'admin.adminOffers' })
	const [tMaterial] = useTranslation('translation', { keyPrefix: 'materials' })
  const [tToolTip] = useTranslation('translation', { keyPrefix: 'tooltips' })

  const hidePopup = () => setDetail({...detail, show: false})
  const updateFilters = (name, value, wait=false) => {
    setFilters(prev => ({...prev, [name]: value}))
    if(!wait){
      setPage({first: 0, page: 0, rows: 6})
      setReset(true)
    }
  }
  const getUserDetail = async id => {
    const _offer = await getOffer(id)
    setDetail({..._offer, show: true})
  }
  const callOffers = async (ex = false) =>{
    let _filter = {}
    if(filters?.keyword != '')
      _filter['keyword'] = encodeURIComponent(`(o.title LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%')`)
    if(filters?.materials?.length > 0)
      _filter['materials'] = "(o.material='" + filters.materials?.join("' OR o.material='") +"')"
    let _offers = await getOffers(_filter, page, ex)
    if(!ex){
      _offers.materials = _offers.materials.map(({material}) => ({label: tMaterial(material), value: material}));
      setOffers(_offers)
    }
  }
  const renderHeader = () => {
    return <div className="filters">
      <MultiSelect 
        optionLabel="label"
        optionValue="value"
        maxSelectedLabels={1} 
        style={{width: '15rem'}}
        optionGroupLabel="label"
        value={filters?.materials} 
        optionGroupChildren="items"
        placeholder={t('multiSelectInputPlaceHolder')} 
        onChange={(e) => updateFilters('materials', e.value)} 
        options={materials?.map(group => ({
          ...group,
          label: tMaterial(group?.label),
          items: group?.items.map(item => ({
            label: tMaterial(item?.label),
            value: item?.label
          }))
        }))} />
      <InputText 
        style={{width: '14rem'}} 
        value={filters?.keyword} 
        placeholder={t('inputSearchPlaceHolder')} 
        onKeyDown={(e) => e.key === 'Enter' ? callOffers() : null} 
        onChange={e => updateFilters('keyword', e.target.value, e.target.value != '')} />
      <Button className="small dark-blue" type="button" onClick={() => callOffers()}>{tGlobal('search')}</Button>
      <Button className="small red-state" type="button" onClick={() => {
        setReset(true)
        setFilters({keyword: '', materials: []})
      }}>{tGlobal('reset')}</Button>
      <Tooltip target=".downloadOffers" showDelay={700}/>
      <Button className="green-earth downloadOffers" data-pr-position="top"  data-pr-tooltip={tToolTip('downloadReportBtn', {items: tToolTip('offers')} )}  onClick={() => callOffers(true)}><FontAwesomeIcon icon={faFileDownload} /></Button>
    </div>
  }
  const rowExpansionTemplate = data => <div className="p-3">
    <DataTable value={data.offers}>
        <Column header="" body={() => "-"} field="id" className="text-center" style={{width: '2.5rem'}}></Column>
        <Column header={t('rowExpansiontitleCompany')} body={({name, picture}) => <>
          <ProfilePhoto userPhoto={picture} />
          <b>{name}</b>
        </>}></Column>
        <Column header={t('rowExpansiontitleBid')} body={({price}) => 
            <>
               {parseInt(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </>}></Column>
        <Column header={t('rowExpansiontitleStatus')} body={({id, rejected, accepted}) => (rejected || (accepted != 0 && accepted != id)) && 
          <span className="text-red-state">{t('statusTextRejected')}</span> || (accepted == id && 
          <span className="text-green-state">{t('statusTextAccepted')}</span>) || 
          <span>Pending</span>}></Column>
        <Column header={t('rowExpansiontitleBiddingDate')} body={({date}) => date.split(' ')[0]}></Column>
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
    <div className={'main__content fullwidth ' + (user.role == 'user' ? 'useroffers' : '')}>
      <h1 className="text-defaultCase mb-1">{t('mainTitle')}</h1>
      <OfferInfo type={user.role == 'user' ? 'min' : 'full'} show={detail.show} offer={detail} onHide={hidePopup}  />
      {typeof offers?.total == 'undefined' && offers?.data?.length == 0 && 
        <TableSkeleton/>
      || 
        <DataTable paginator stripedRows lazy
          dataKey="id" 
          page={page.page}
          rows={page.rows} 
          first={page.first}
          value={offers?.data} 
          header={renderHeader}
          expandedRows={expandedRows} 
          totalRecords={offers?.total} 
          emptyMessage={t('noOffersFoundText')}
          onRowToggle={e => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          onPage={({first, page, rows}) => setPage({first, page, rows})}>
          {user.role != 'company' && 
            <Column expander={({offers}) => offers?.length > 0 } style={{width: "2.5rem"}} /> || null}
          {/* <Column header={null} body={ProfilePhoto}></Column> */}
          {user.role != 'user' && 
            <Column header={t('tableTitleUser')} body={({name, picture}) => <><ProfilePhoto userPhoto={picture} /> {name}</>}></Column>
          || null}
          <Column header={t('tableTitleSubject')} field="title"></Column>
          <Column header={t('tableTitleMaterial')} body={({material}) => 
            <Button label={tMaterial(material)} className={'small ' + material} />}></Column>
          <Column header={t('tableTitleQuantity')} body={({quantity, unit}) => quantity + ' ' + unit}></Column>
          <Column header={t('tableTitleSellPrice')} body={({price}) => 
           <span className='price__background'>{parseInt(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>}></Column>
          {user.role == 'user' && 
            <Column header="Offers" body={({offers}) => offers?.length || 0}></Column>
          || null}
          <Column header={t('tableTitlePublishedDate')} body={({date}) => date.split(' ')[0]}></Column>
          <Column header={t('rowExpansiontitleStatus')} body={({status, state}) => {
            if(state == 2)        return t('statusTextDeleted')
            else if(status == 0)  return t('statusTextPending')
            else                  return t('statusTextAccepted')
          }}></Column>
          {user.role == 'user' && 
            <Column className="actions" header={null} body={offer => 
              <Button className="small dark-blue" onClick={() => getUserDetail(offer?.id)}><FontAwesomeIcon icon={faSearch} /></Button>}></Column> || 
            <Column className="actions" header={null} body={offer => { 
                return <>
                <Tooltip target=".viewOffer" showDelay={700}/>
                <Button className="small dark-blue viewOffer" data-pr-position="top" data-pr-tooltip={tToolTip("viewItemBtn", {item: tToolTip('offer')})}  onClick={() => getUserDetail(offer?.id)}><FontAwesomeIcon icon={faSearch} /></Button>
              {offer.status == 0 && 
              <>
              <Tooltip target=".messageUser" showDelay={700}/>
              <Link data-pr-position="top" data-pr-tooltip={tToolTip("sendMessage")} className="button small green-earth messageUser" to={`/chat/${offer.username}/${offer.id}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link> 
              </>
              || 
              <Link className="button small green-earth" to={`/chat/${offer.username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>
              }
            </> || null}}></Column>}
        </DataTable>
      }
    </div>
  </div>
}

export default AdminOffers