import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { useDispatch, useSelector } from 'react-redux'
import { faSearch, faTrash, faTags, faFileDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next'
import { Tooltip}  from 'primereact/tooltip'
import { setHeader } from '@store/slices/globalSlice'
import { getProducts, updateProduct } from '@services/productServices'
import TableSkeleton from '@ui/skeletons/tableSkeleton/TableSkeleton'
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import { InputSwitch } from 'primereact/inputswitch'
import { Avatar } from 'primereact/avatar'
import ConfirmationModal from '@ui/modals/ConfirmationModal'

const Products = () => {
  const dispatch = useDispatch()
  const [reset, setReset] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [selected, setSelected] = useState(false)
  const [products, setProducts] = useState({data: []})
  const [page, setPage] = useState({first: 0, page: 0, rows: 6})
  const user = useSelector((state) => state.users.userData)
  const [filters, setFilters] = useState({keyword: ''})
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})
  const [t] = useTranslation('translation', { keyPrefix: 'admin.products' })
  const [tProduct] = useTranslation('translation', { keyPrefix: 'vendor.products.product'})
  const [tToolTip] = useTranslation('translation', { keyPrefix: 'tooltips' })

  function keepFirstLetters(inputString) {
    const words = inputString.split(' ');
    const firstLetters = words.map(word => word[0]).join('');
    return firstLetters;
  }
  
  const changeState = async action => {
    setConfirm(false)
    if(action){
      await updateProduct({state: 2}, {id: selected})
      setReset(true)
    }
  }
  const updateFilters = (name, value, wait=false) => {
    setFilters(prev => ({...prev, [name]: value}))
    if(!wait){
      setPage({first: 0, page: 0, rows: 6})
      setReset(true)
    }
  }
  const callProducts = async (ex = false) =>{
    let _filter = {}
    if(filters?.keyword != '')
      _filter['keyword'] = encodeURIComponent(`(p.name LIKE '%${filters.keyword}%')`)
    const _products = await getProducts(_filter, page, null, ex)
    if(!ex)
      setProducts(_products)
  }
  const renderHeader = () => {
    return <div className="filters">
      <InputText 
        style={{width: '14rem'}} 
        value={filters?.keyword} 
        placeholder={t('inputSearchPlaceHolder')} 
        onKeyDown={(e) => e.key === 'Enter' ? callProducts() : null} 
        onChange={e => updateFilters('keyword', e.target.value, e.target.value != '')} />
      <Button className="small dark-blue" type="button" onClick={() => callProducts()}>{tGlobal('search')}</Button>
      <Button className="small red-state" type="button" onClick={() => {
        setReset(true)
        setFilters({keyword: ''})
      }}>{tGlobal('reset')}</Button>
      <Tooltip target=".downloadProducts" />
      <Button data-pr-position="top"  data-pr-tooltip={tToolTip('downloadReportBtn', {items: tToolTip('products')} )} className="green-earth downloadProducts" onClick={() => callProducts(true)}><FontAwesomeIcon icon={faFileDownload} /></Button>
    </div>
  }

  useEffect(() => {
    callProducts()
    setReset(false)
  }, [page, reset])
  useEffect(() => {
    dispatch(setHeader('user'))
  }, [user])
  
  return <div className="layout">
    <ConfirmationModal title={user?.role == "admin" ? tProduct('disableProductTitle') : tProduct('deleteProductTitle')} visible={confirm} action={changeState} type={user?.role} />
    <img className="layout__background" src="/assets/full-width.svg" />
    <div className={'main__content fullwidth'}>
      <h1 className="text-defaultCase mb-1">{t('mainTitle')}</h1>
      {typeof products?.total == 'undefined' && products?.data?.length == 0 && 
        <TableSkeleton />
      || <>
        <DataTable paginator stripedRows lazy
          emptyMessage={t('noProductsFoundText')}
          dataKey="id" 
          page={page.page} 
          rows={page.rows} 
          first={page.first} 
          value={products?.data} 
          header={renderHeader} 
          totalRecords={products?.total} 
          onPage={({first, page, rows}) => setPage({first, page, rows})}>
          <Column headerClassName='table-header-styles' header={t('tableTitleName')} field="name" bodyClassName='table-body-styles' body={({name, picture})=>{
            const initials = keepFirstLetters(name)
            return <div className="flex aligncenter">
              <Avatar  icon={<FontAwesomeIcon  color='#fff' icon={faTags}/>} style={{ backgroundColor: 'var(--dark-blue)', color: '#ffffff' }} image={picture} shape="circle" />
              <p className='ml-1 mb-0'>{name}</p>
            </div>;
          }}></Column>
          <Column header={t('tableTitlePrice')} body={({price}) => <>
            <span className='table-item__background'>{parseInt(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
          </>}></Column>
          <Column header={t('tableTitlePublishedBy')}  body={({username, upicture}) => <><ProfilePhoto userPhoto={upicture} /> {username}</>}></Column>
          <Column header={t('tableTitleState')} body={({id, state}) => {
            return <>
            <Tooltip target=".stateInput" />
            <InputSwitch className='stateInput' data-pr-position="left" data-pr-tooltip={state == 1 ? tToolTip("enableSateSwitchInputMessage") : tToolTip("disableSateSwitchInputMessage")} checked={state == 1} onChange={async (e) => {
                if(state == 1){
                  setSelected(id)
                  setConfirm(true)
                }else{
                  await updateProduct({state: 1}, {id: id})
                  setReset(true)
                }
              }} />
            </>
          }}></Column>
          <Column className="actions" header={null} body={({id, username}) => <>
          <Tooltip target=".viewProduct" />
            <Link className="button small dark-blue viewProduct" data-pr-position="top" data-pr-tooltip={tToolTip("viewItemBtn", {item: tToolTip('product')})}  to={`/product/${id}`}><FontAwesomeIcon icon={faSearch} /></Link>
            <Tooltip target=".sendMsgBtn" />
            <Link data-pr-tooltip={tToolTip("sendMessage")} data-pr-position="top" className="button small green-earth sendMsgBtn" to={`/chat/${username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>
          </>}></Column>
        </DataTable>
      </>}
    </div>
  </div>
}

export default Products