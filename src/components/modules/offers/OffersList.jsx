import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { useDispatch, useSelector } from 'react-redux'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'

import OfferInfo from '@modules/offers/OfferInfo'
import { getOffers } from '@services/offersServices'
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import { setHeader, updateAddLink } from '@store/slices/globalSlice'

const Offers = () => {
  const dispatch = useDispatch()
  const [detail, setDetail] = useState({})
  const [filters, setFilters] = useState({})
  const [page, setPage] = useState({page: 0, rows: 6})
  const [expandedRows, setExpandedRows] = useState({})
  const [offers, setOffers] = useState({total: 0, data: []})
  const user = useSelector((state) => state.users.userData)

  const hidePopup = () => setDetail({...detail, show: false})
  const callOffers = async () =>{
    let _filter
    if(user.role == 'user'){
      _filter = { ...filters, 'o.user': user?.id }
    }else{
      let _materials = user?.materials?.map(material => material.type)
      _filter = { ...filters, 'materials': "(o.material='" + _materials?.join("' OR o.material='") +"')" }
    }
    const _offers = await getOffers(_filter, page)
    setOffers(_offers)
  }
  const rowExpansionTemplate = data => <div className="p-3">
    <DataTable className="no-head" value={data.offers}>
        <Column header={null} field={null} style={{width: '48px'}}></Column>
        <Column header="Company" body={({company}) => <b>{company}</b>}></Column>
        <Column header="Price offer" body={({price}) => 
            <>
              <b>Offer price:</b> {parseInt(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </>}></Column>
        <Column header="Status" body={({id, rejected, accepted}) => (rejected || (accepted != 0 && accepted != id)) && 
          <span className="text-red-state">Rejected</span> || (accepted == id && 
          <span className="text-green-state">Accepted</span>) || 
          <span>Pending</span>}></Column>
        <Column className="actions" header={null} body={offer => 
          <Link className="button small green-earth" to={`/chat/${offer.username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>}></Column>
    </DataTable>
  </div>

  useEffect(() => {
    callOffers()
  }, [page])
  useEffect(() => {
    dispatch(setHeader('user'))
    if(user.role == 'user')
      dispatch(updateAddLink('/offers/new/'))
  }, [user])

  console.log(offers)
  
  return <div className="layout">
    <img className="layout__background" src="/assets/full-width.svg" />
    <div className={'main__content centerwidth alignttop ' + (user.role == 'user' ? 'useroffers' : '')}>
      <OfferInfo type={user.role == 'user' ? 'min' : 'full'} show={detail.show} offer={detail} onHide={hidePopup}  />
      <h1 className='text-defaultCase'>Offers</h1>
      {offers?.data?.length ? 
        <DataTable paginator stripedRows lazy
          dataKey="id" 
          page={page.page}
          rows={page.rows} 
          className="mt-2" 
          value={offers?.data} 
          expandedRows={expandedRows} 
          totalRecords={offers?.total} 
          onRowToggle={e => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          onPage={({page, rows}) => setPage({page, rows})}>
          {user.role == 'user' && 
            <Column expander={({offers}) => offers?.length > 0 } /> || null}
          {/* <Column header={null} body={ProfilePhoto}></Column> */}
          {user.role != 'user' && 
            <Column header="User" field="name"></Column>
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
          <Column header="Published" field="date"></Column>
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