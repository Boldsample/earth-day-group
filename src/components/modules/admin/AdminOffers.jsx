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

const AdminOffers = () => {
  const dispatch = useDispatch()
  const [detail, setDetail] = useState({})
  const [reset, setReset] = useState(false)
  const [offers, setOffers] = useState({data: []})
  const [page, setPage] = useState({page: 0, rows: 6})
  const [expandedRows, setExpandedRows] = useState({})
  const user = useSelector((state) => state.users.userData)
  const [filters, setFilters] = useState({keyword: '', materials: []})
  const [t] = useTranslation('translation', { keyPrefix: 'admin.adminOffers' })

  const hidePopup = () => setDetail({...detail, show: false})
  const updateFilters = (name, value) => setFilters(prev => ({...prev, [name]: value}))
  const getUserDetail = async id => {
    const _offer = await getOffer(id)
    setDetail({..._offer, show: true})
  }
  const callOffers = async () =>{
    let _filter = {}
    if(filters?.keyword != '')
      _filter['keyword'] = `(o.title LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%')`
    const _offers = await getOffers(_filter, page)
    setOffers(_offers)
  }
  const renderHeader = () => {
    return <div className="filters">
      <MultiSelect value={filters?.materials} maxSelectedLabels={1} onChange={(e) => updateFilters('materials', e.value)} options={offers?.materials} optionLabel="value" placeholder={t('multiSelectInputPlaceHolder')} />
      <InputText value={filters?.keyword} onChange={e => updateFilters('keyword', e.target.value)} placeholder={t('inputSearchPlaceHolder')} />
      <Button className="small dark-blue" type="button" onClick={callOffers}><FontAwesomeIcon icon={faPaperPlane} /></Button>
      <Button className="small red-state" type="button" onClick={() => {
        setReset(true)
        setFilters({keyword: '', materials: []})
      }}><FontAwesomeIcon icon={faTrash} /></Button>
      {user?.role == 'user' && 
        <Link className="button small green-earth" to="/offers/new/"><FontAwesomeIcon icon={faPlus} /> New Offer</Link>
      }
    </div>
    // <div className="flex aligncenter">
    //   <h1 className="text-defaultCase">Offers</h1>
    // </div>
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
      || (offers?.total > 0 && 
        <DataTable paginator stripedRows lazy
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
          {user.role != 'company' && 
            <Column expander={({offers}) => offers?.length > 0 } style={{width: "2.5rem"}} /> || null}
          {/* <Column header={null} body={ProfilePhoto}></Column> */}
          {user.role != 'user' && 
            <Column header={t('tableTitleUser')} body={({name, picture}) => <><ProfilePhoto userPhoto={picture} /> {name}</>}></Column>
          || null}
          <Column header={t('tableTitleSubject')} field="title"></Column>
          <Column header={t('tableTitleMaterial')} body={({material}) => 
            <Button label={material} className={'small ' + material} />}></Column>
          <Column header={t('tableTitleQuantity')} body={({quantity, unit}) => quantity + ' ' + unit}></Column>
          <Column header={t('tableTitleSellPrice')} body={({price}) => 
           <span className='price__background'>{parseInt(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>}></Column>
          {user.role == 'user' && 
            <Column header="Offers" body={({offers}) => offers?.length || 0}></Column>
          || null}
          <Column header={t('tableTitlePublishedDate')} body={({date}) => date.split(' ')[0]}></Column>
          {user.role == 'user' && 
            <Column className="actions" header={null} body={offer => 
              <Button className="small dark-blue" onClick={() => getUserDetail(offer?.id)}><FontAwesomeIcon icon={faSearch} /></Button>}></Column> || 
            <Column className="actions" header={null} body={offer => <>
              <Button className="small dark-blue" onClick={() => getUserDetail(offer?.id)}><FontAwesomeIcon icon={faSearch} /></Button>
              {offer.status == 0 && 
                <Link className="button small green-earth" to={`/chat/${offer.username}/${offer.id}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link> || 
                <Link className="button small green-earth" to={`/chat/${offer.username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>
              }
            </> || null}></Column>}
        </DataTable>
      ) ||
        <div className="mt-2">
          <p>{user.role == 'user' ? t('noOffersPostedText') : t('noOffersFoundText')}</p>
          {user.role == 'user' && 
            <Link className="button dark-blue mt-1" to="/offers/new">Create post offer</Link>
          || null}
        </div>
      }
    </div>
  </div>
}

export default AdminOffers