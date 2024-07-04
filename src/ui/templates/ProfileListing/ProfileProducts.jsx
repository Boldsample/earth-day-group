import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { InputText } from "primereact/inputtext"
import { Paginator } from "primereact/paginator"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronRight, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons"

import { setHeader } from "@store/slices/globalSlice"
import MultiUseCard from "@ui/cards/multiUseCard/MultiUseCard"
import CardSkeleton from "@ui/skeletons/cardSkeleton/CardSkeleton"
import { followProduct, getProducts } from "@services/productServices"

const ProfileProducts = ({user, same = false, related = false}) => {
  const dispatch = useDispatch()
  const skeletonPlaceHolder = ["", "", "", ""]
  const [filters, setFilters] = useState({keyword: ''})
  const userId = useSelector((state) => state.users.userData.id)
  const [elements, setElements] = useState({data: []})
  const [page, setPage] = useState({page: 0, rows: related ? 4 : 8})

  const doFollow = async (id) => {
    await followProduct({type: 'product', entity: id, follower: userId})
    loadElements()
  }
  const loadElements = async e => {
    if(e) e?.preventDefault()
    setElements({data: []})
    let _filter = {user: `p.user=${user}`}
    if(filters?.keyword != '')
      _filter['keyword'] = `(p.name LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
    const _products = await getProducts(_filter, page, userId)
    setElements(_products)
  }

  useEffect(() => {
    loadElements();
    dispatch(setHeader("user"));
  }, [page]);

  return <div className="template__listing fullwidth">
    <div className="search mb-1">
      <h3 className="text-center mb-1">{related ? 'Related products' : 'Discover our products'}</h3>
      {!related && (typeof elements?.total == 'undefined' || elements?.total > 0) && 
        <form onSubmit={loadElements} className="p-input-icon-left fullwidth">
          <FontAwesomeIcon icon={faSearch} />
          <InputText
            placeholder={"Search"}
            value={filters.keyword}
            className="p-inputtext"
            onChange={(e) => setFilters(prev => ({...prev, keyword: e.target.value}))} />
          <Link type="submit"><FontAwesomeIcon icon={faCircleChevronRight} /></Link>
        </form>
      }
    </div>
    <div className="templateCards_grid">
      {typeof elements?.total == 'undefined' && elements?.data?.length == 0 && 
        skeletonPlaceHolder.map((skeleton, key) =>  <CardSkeleton key={key} />)
      || (elements?.total > 0 && 
        elements?.data?.map(element => <MultiUseCard key={element.id} type={elements?.card || 'company'} data={element} action={doFollow} />)
      ) ||
        <div className="fullwidth text-center mt-2">
          <p>There's no products for this store</p>
        </div>
      }
      {!related && page?.rows < elements?.total && 
        <Paginator first={page?.page} rows={page?.rows} totalRecords={elements.total} onPageChange={e => setPage({page: e.first, rows: e.rows})} />
      }
      {same && 
        <div className="fullwidth text-center">
          <Link className="button small blue-earth self-center" to="/product/new/"><FontAwesomeIcon icon={faPlus} /> New product</Link>
        </div>
      }
    </div>
  </div>
}

export default ProfileProducts