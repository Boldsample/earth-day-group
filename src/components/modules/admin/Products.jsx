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
import { useTranslation } from 'react-i18next'

import { setHeader } from '@store/slices/globalSlice'
import { getProducts, updateProduct } from '@services/productServices'
import TableSkeleton from '@ui/skeletons/tableSkeleton/TableSkeleton'
import { Dropdown } from 'primereact/dropdown'
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'

const Products = () => {
  const dispatch = useDispatch()
  const [reset, setReset] = useState(false)
  const [products, setProducts] = useState({data: []})
  const [page, setPage] = useState({page: 0, rows: 6})
  const user = useSelector((state) => state.users.userData)
  const [filters, setFilters] = useState({keyword: ''})
  const [t] = useTranslation('translation', { keyPrefix: 'admin.products' })
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})

  const stateDropDownText = [
    {
      "name": tGlobal('active'),
      "code": "1"
    },
    {
      "name": tGlobal('disable'),
      "code": "2"
    }
  ]

  const changeState = async (id, state) => {
    await updateProduct({state: state}, {id: id})
    setReset(true)
  }
  const updateFilters = (name, value) => setFilters(prev => ({...prev, [name]: value}))
  const callProducts = async () =>{
    let _filter = {}
    if(filters?.keyword != '')
      _filter['keyword'] = `(p.name LIKE '%${filters.keyword}%')`
    const _products = await getProducts(_filter, page)
    setProducts(_products)
  }
  const renderHeader = () => {
    return <div className="filters">
      <InputText value={filters?.keyword} onChange={e => updateFilters('keyword', e.target.value)} placeholder={tGlobal('inputSearchPlaceHolder')} />
      <Button className="small dark-blue" type="button" onClick={callProducts}><FontAwesomeIcon icon={faPaperPlane} /></Button>
      <Button className="small red-state" type="button" onClick={() => {
        setReset(true)
        setFilters({keyword: ''})
      }}><FontAwesomeIcon icon={faTrash} /></Button>
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
          value={products?.data} 
          header={renderHeader} 
          totalRecords={products?.total} 
          onPage={({page, rows}) => setPage({page, rows})}>
          <Column header={t('tableTitlePublishedBy')} body={({username, picture}) => <><ProfilePhoto userPhoto={picture} /> {username}</>}></Column>
          <Column header={t('tableTitleName')} field="name"></Column>
          <Column header={t('tableTitlePrice')} body={({price}) => <>
            {parseInt(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </>}></Column>
          <Column header={t('tableTitleState')} body={({id, state}) => 
            <Dropdown value={state} onChange={e => changeState(id, e.value)} optionLabel="name" optionValue="code" options={stateDropDownText} />
          }></Column>
          <Column className="actions" header={null} body={({id, username}) => <>
            <Link className="button small dark-blue" to={`/product/${id}`}><FontAwesomeIcon icon={faSearch} /></Link>
            <Link className="button small green-earth" to={`/chat/${username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>
          </>}></Column>
        </DataTable>
      </>}
    </div>
  </div>
}

export default Products