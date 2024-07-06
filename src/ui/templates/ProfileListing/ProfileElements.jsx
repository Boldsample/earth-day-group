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
import { getPets } from "@services/petServices"

const ProfileElements = ({type = 'products', user, same = false, related = false, types = []}) => {
  const dispatch = useDispatch()
  const skeletonPlaceHolder = ["", "", "", ""]
  const [elements, setElements] = useState(null)
  const [filters, setFilters] = useState({keyword: ''})
  const userId = useSelector((state) => state.users.userData.id)
  const [page, setPage] = useState({page: 0, rows: related ? 4 : 8})

  const doFollow = async (id) => {
    const _type = type == 'products' ? 'product' : 'pet'
    await followProduct({type: _type, entity: id, follower: userId})
    loadElements()
  }
  const loadElements = async e => {
    if(e) e?.preventDefault()
    if(elements !== null)
      setElements({data: []})
    if(type == 'products'){
      let _filter = {user: `p.user=${user}`}
      if(filters?.keyword != '')
        _filter['keyword'] = `(p.name LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
      const _products = await getProducts(_filter, page, userId)
      setElements(_products)
    }else{
      let _filter = {user: `p.user=${user}`}
      if(filters?.keyword != '')
        _filter['keyword'] = `(p.name LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
      const _pets = await getPets(_filter, page, userId)
      setElements(_pets)
    }
  }

  useEffect(() => {
    loadElements();
    dispatch(setHeader("user"));
  }, [page, type]);
  
  if(elements == null || elements?.total == 0)
    return
  return <div className="template__listing fullwidth">
    <div className="edg-search mb-1">
      <h3 className="text-center mb-1">{related && (type == 'products' ? 'Related products' : `Here are some 'friends you may like'`) || (type == 'products' ? 'Discover our products' : 'Want to adopt a new friend?')}</h3>
      {!related && (typeof elements?.total == 'undefined' || elements?.total > 0) && 
        <form onSubmit={loadElements} className="p-input-icon-left fullwidth">
          <FontAwesomeIcon icon={faSearch} />
          <InputText
            placeholder={"Search"}
            value={filters.keyword}
            className="p-inputtext"
            onChange={(e) => setFilters(prev => ({...prev, keyword: e.target.value}))} />
          <Link onClick={loadElements}><FontAwesomeIcon icon={faCircleChevronRight} /></Link>
        </form>
      }
      <div className="types">
        {types?.map((listType, key) => <Link key={key} to={listType?.url} className={type == listType?.id ? 'active' : ''}>{listType?.label}</Link>)}
      </div>
    </div>
    <div className="templateCards_grid">
      {typeof elements?.total == 'undefined' && elements?.data?.length == 0 && 
        skeletonPlaceHolder.map((skeleton, key) =>  <CardSkeleton key={key} />)
      || (elements?.total > 0 && 
        elements?.data?.map(element => <MultiUseCard key={element.id} type={elements?.card || 'company'} data={element} action={doFollow} />)
      ) ||
        <div className="fullwidth text-center mt-2">
          <p>We couldn't find what you are looking for. Care to try again.</p>
        </div>
      }
      {!related && page?.rows < elements?.total && 
        <Paginator first={page?.page} rows={page?.rows} totalRecords={elements.total} onPageChange={e => setPage({page: e.first, rows: e.rows})} />
      }
      {same && 
        <div className="fullwidth text-center">
          {type == 'products' && 
            <Link className="button small blue-earth self-center" to="/product/new/"><FontAwesomeIcon icon={faPlus} /> New product</Link> ||
            <Link className="button small green-earth self-center" to="/pet/new/"><FontAwesomeIcon icon={faPlus} /> New pet</Link>
          }
        </div>
      }
    </div>
  </div>
}

export default ProfileElements