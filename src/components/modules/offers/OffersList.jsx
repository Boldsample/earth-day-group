import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { useDispatch, useSelector } from 'react-redux'
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'

import OfferInfo from '@modules/offers/OfferInfo'
import { getOffers } from '@services/offersServices'
import { setHeader, updateAddLink } from '@store/slices/globalSlice'
import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'

const Offers = () => {
  const dispatch = useDispatch()
  const [detail, setDetail] = useState({})
  const [page, setPage] = useState({page: 0, rows: 6})
  const [expandedRows, setExpandedRows] = useState({})
  const user = useSelector((state) => state.users.userData)
  const [offers, setOffers] = useState({total: 0, data: []})
  const [filters, setFilters] = useState({keyword: '', materials: []})

  const updateFilters = (name, value) => {
    setFilters(prev => ({...prev, [name]: value}))
  }
  const hidePopup = () => setDetail({...detail, show: false})
  const callOffers = async () =>{
    let _filter = {}
    if(user.role == 'user')
      _filter['user'] = `o.user=${user?.id}`
    if(filters?.keyword != '')
      _filter['keyword'] = `(o.title LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%')`
    if(filters?.materials?.length > 0){
      _filter['materials'] = "(o.material='" + filters.materials?.join("' OR o.material='") +"')"
    }else if(user.role == 'company'){
      let _materials = user?.materials?.map(material => material.type)
      if(_materials?.length > 0)
      _filter['materials'] = "(o.material='" + _materials.join("' OR o.material='") +"')"
    }
    const _offers = await getOffers(_filter, page)
    setOffers(_offers)
  }
  const renderHeader = () => {
    return <div className="filters">
      <MultiSelect value={filters?.materials} maxSelectedLabels={1} onChange={(e) => updateFilters('materials', e.value)} options={offers?.materials} optionLabel="value" 
  placeholder="Filter by materials" />
      <InputText value={filters?.keyword} onChange={e => updateFilters('keyword', e.target.value)} placeholder="Keyword Search" />
      <Button className="red-state" type="button" onClick={() => {}}><FontAwesomeIcon icon={faTrash} /></Button>
      <Button className="green-earth" type="button" onClick={callOffers}><FontAwesomeIcon icon={faPaperPlane} /></Button>
    </div>
    // <div className="flex aligncenter">
    //   <h1 className="text-defaultCase">Offers</h1>
    // </div>
  }
  const rowExpansionTemplate = data => <div className="p-3">
    <DataTable className="no-head" value={data.offers}>
        <Column header="ID" body={() => "-"} field="id" className="text-center" style={{width: '40rem'}}></Column>
        <Column header="Company" body={({name, picture}) => <>
          <ProfilePhoto userPhoto={picture} />
          <b>{name}</b>
        </>}></Column>
        <Column header="Price offer" body={({price}) => 
            <>
              <b>Offer:</b> {parseInt(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </>}></Column>
        <Column header="Status" body={({id, rejected, accepted}) => (rejected || (accepted != 0 && accepted != id)) && 
          <span className="text-red-state">Rejected</span> || (accepted == id && 
          <span className="text-green-state">Accepted</span>) || 
          <span>Pending</span>}></Column>
        <Column header="Published" body={({date}) => date.split(' ')[0]}></Column>
        <Column className="actions" header={null} body={offer => 
          <Link className="button small green-earth" to={`/chat/${offer.username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>}></Column>
    </DataTable>
  </div>
  console.log(offers)

  useEffect(() => {
    callOffers()
  }, [page])
  useEffect(() => {
    dispatch(setHeader('user'))
    if(user.role == 'user')
      dispatch(updateAddLink('/offers/new/'))
  }, [user])
  
  return <div className="layout">
    <img className="layout__background" src="/assets/full-width.svg" />
    <div className={'main__content fullwidth ' + (user.role == 'user' ? 'useroffers' : '')}>
      <h1 className="text-defaultCase mb-1">Offers</h1>
      <OfferInfo type={user.role == 'user' ? 'min' : 'full'} show={detail.show} offer={detail} onHide={hidePopup}  />
      {offers?.data?.length ? 
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
          {user.role == 'user' && 
            <Column expander={({offers}) => offers?.length > 0 } style={{width: "40rem"}} /> || null}
          {/* <Column header={null} body={ProfilePhoto}></Column> */}
          {user.role != 'user' && 
            <Column header="User" body={({name, picture}) => <><ProfilePhoto userPhoto={picture} /> {name}</>}></Column>
          || null}
          <Column header="Title" field="title"></Column>
          <Column header="Material" body={({material}) => 
            <Button label={material} className={'small ' + material} />}></Column>
          <Column header="Quantity" body={({quantity, unit}) => quantity + ' ' + unit}></Column>
          <Column header="Asking" body={({price}) => 
            parseInt(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}></Column>
          {user.role == 'user' && 
            <Column header="Offers" body={({offers}) => offers?.length || 0}></Column>
          || null}
          <Column header="Published" body={({date}) => date.split(' ')[0]}></Column>
          {user.role == 'user' && 
            <Column className="actions" header={null} body={offer => 
              <Button className="small dark-blue" onClick={() => setDetail({...offer, show: true})}><FontAwesomeIcon icon={faSearch} /></Button>}></Column> || 
            <Column className="actions" header={null} body={offer => <>
              <Button className="small dark-blue" onClick={() => setDetail({...offer, show: true})}><FontAwesomeIcon icon={faSearch} /></Button>
              {offer.status == 0 && 
                <Link className="button small green-earth" to={`/chat/${offer.username}/${offer.id}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link> || 
                <Link className="button small green-earth" to={`/chat/${offer.username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>
              }
            </> || null}></Column>}
        </DataTable> : 
        <div className="mt-2">
          <p>{user.role == 'user' ? "You didn’t post any offer yet." : "There's no offers for the materials you buy"}</p>
          {user.role == 'user' && 
            <Link className="button dark-blue mt-1" to="/offers/new">Create post offer</Link>
          || null}
        </div>
      }
    </div>
  </div>
}

export default Offers