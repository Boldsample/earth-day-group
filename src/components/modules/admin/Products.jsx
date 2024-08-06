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
      <InputText value={filters?.keyword} onChange={e => updateFilters('keyword', e.target.value)} placeholder="Keyword Search" />
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
      <h1 className="text-defaultCase mb-1">Products</h1>
      {typeof products?.total == 'undefined' && products?.data?.length == 0 && 
        <TableSkeleton />
      || <>
        <DataTable paginator stripedRows lazy
          dataKey="id" 
          page={page.page} 
          rows={page.rows} 
          value={products?.data} 
          header={renderHeader} 
          totalRecords={products?.total} 
          onPage={({page, rows}) => setPage({page, rows})}>
          <Column header="Published by" body={({username, picture}) => <><ProfilePhoto userPhoto={picture} /> {username}</>}></Column>
          <Column header="Name" field="name"></Column>
          <Column header="Description" field="description"></Column>
          <Column header="Published" field="date"></Column>
          <Column header="State" body={({id, state}) => 
            <Dropdown value={state} onChange={e => changeState(id, e.value)} optionLabel="name" optionValue="code" options={[
              {name: "Active", code: "1"},
              {name: "Disable", code: "2"}
            ]} />
          }></Column>
          <Column className="actions" header={null} body={({id, username}) => <>
            <Link className="button small dark-blue" to={`/product/${id}`}><FontAwesomeIcon icon={faSearch} /></Link>
            <Link className="button small green-earth" to={`/chat/${username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>
          </>}></Column>
        </DataTable>
        {products?.total == 0 && 
          <div className="mt-2">
            <p>There's no products for this filter options.</p>
          </div>
        }
      </>}
    </div>
  </div>
}

export default Products