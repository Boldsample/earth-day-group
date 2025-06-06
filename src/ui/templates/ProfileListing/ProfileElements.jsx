import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { InputText } from "primereact/inputtext"
import { Paginator } from "primereact/paginator"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronRight, faPlus, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"
import { useTranslation } from 'react-i18next'

import { setHeader } from "@store/slices/globalSlice"
import { useNotifications } from "@components/WebSocket"
import MultiUseCard from "@ui/cards/multiUseCard/MultiUseCard"
import CardSkeleton from "@ui/skeletons/cardSkeleton/CardSkeleton"
import { followProduct, getProducts } from "@services/productServices"
import { getPets } from "@services/petServices"
import { ProgressSpinner } from "primereact/progressspinner"

const ProfileElements = ({entity = null, type = 'products', user, same = false, related = false, types = []}) => {
  const dispatch = useDispatch()
  const skeletonPlaceHolder = ["", "", "", ""]
  const [elements, setElements] = useState(null)
  const [filters, setFilters] = useState({keyword: ''})
  const { sendNotificationMessage } = useNotifications()
  const loggedUser = useSelector((state) => state.users.userData)
  const [tGlobal2] = useTranslation('translation', {keyPrefix: 'global'})
  const [page, setPage] = useState({first: 0, page: 0, rows: related ? 3 : 7})
  const [tListing] = useTranslation('translation', { keyPrefix: 'ui.templates.categoryListing'})
  const [t] = useTranslation('translation', { keyPrefix: 'ui.templates.profileListing.profileElements'})

  const doFollow = async (id) => {
    const _type = type == 'products' ? 'product' : 'pet'
    await followProduct({type: _type, entity: id, follower: loggedUser?.id}, sendNotificationMessage)
    loadElements()
  }
  const loadElements = async e => {
    if(e) e?.preventDefault()
    if(elements !== null)
      setElements({data: []})
    if(type == 'products'){
      let _filter = {user: `p.user=${user}`, state: `p.state=1`, exclude: `p.id<>${entity}`}
      if(filters?.keyword != '')
        _filter['keyword'] = encodeURIComponent(`(p.name LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`)
      const _products = await getProducts(_filter, page, loggedUser?.id)
      setElements(_products)
    }else{
      let _filter = {user: `p.user=${user}`, stete: `p.state=1`, exclude: `p.id<>${entity}`}
      if(filters?.keyword != '')
        _filter['keyword'] = encodeURIComponent(`(p.name LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`)
      const _pets = await getPets(_filter, page, loggedUser?.id)
      setElements(_pets)
    }
  }

  useEffect(() => {
    loadElements();
    dispatch(setHeader("user"));
  }, [page, type, user]);
  
//   if(elements == null || elements?.total == 0)
//     return
  return <div className="template__listing fullwidth">
    <div className="edg-search mb-1">
      <h3 className="text-center mb-1">{(same && (type == 'products' ? t('productsTitle0') : t('adoptPetTitle0'))) || (related && (type == 'products' ? t('productsTitle1') : t('adoptPetTitle1'))) || (type == 'products' ? t('productsTitle2')  : t('adoptPetTitle2'))}</h3>
      {!related && (typeof elements?.total == 'undefined' || elements?.total > 0) && 
        <form onSubmit={loadElements} className="p-input-icon-left fullwidth">
          <FontAwesomeIcon icon={faSearch} />
          <InputText
            placeholder={tGlobal2('inputSearchPlaceHolder')}
            value={filters.keyword}
            className="p-inputtext"
            onChange={(e) => setFilters(prev => ({...prev, keyword: e.target.value}))} />
          {filters?.keyword && 
            <Link className="reset" onClick={() => { setFilters({keyword: ''}); loadElements() }}><FontAwesomeIcon icon={faTimes} /></Link>
          }
          <button className="green-earth ml-1" onClick={loadElements}>{tListing('search')}</button>
        </form>
      }
      <div className="types">
        {types?.map((listType, key) => <Link key={key} to={listType?.url} className={type == listType?.id ? 'active' : ''}>{listType?.label}</Link>)}
      </div>
    </div>
    <div className={`templateCards_grid cards-${elements?.data?.length}`}>
      {typeof elements?.total == 'undefined' && elements?.data?.length == 0 && <ProgressSpinner />
        //skeletonPlaceHolder.map((skeleton, key) =>  <CardSkeleton key={key} />)
      || ((elements?.total > 0 || loggedUser?.role != 'user') && <>
        {same && 
          <MultiUseCard type="add" action={type == 'products' ? '/product/new/' : '/pet/new/'} listType={type} />
        }
        {elements?.data?.map(element => <MultiUseCard key={element.id} type={elements?.card || 'company'} data={element} action={doFollow} bookmark={loggedUser?.role != 'admin' && element?.user != loggedUser?.id} />)}
      </>) ||
        <div className="fullwidth text-center mt-2">
          <p>{tGlobal2('notfoundErrorMessage')}</p>
        </div>
      }
      {!related && page?.rows < elements?.total && 
        <Paginator first={page?.first} page={page?.page} rows={page?.rows} totalRecords={elements.total} onPageChange={e => setPage({first: e.first, page: e.page, rows: e.rows})} />
      }
    </div>
  </div>
}

export default ProfileElements