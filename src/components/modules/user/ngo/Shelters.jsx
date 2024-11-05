import {useState, useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux"

import { getPets } from '@services/petServices'
import { getUsers } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import CategoryListing from "@ui/templates/categoryListing/CategoryListing"
import { useTranslation } from 'react-i18next'

const Shelters = ({type}) => {
  const dispatch = useDispatch()
  const [page, setPage] = useState({page: 0, rows: 8})
  const [filters, setFilters] = useState({keyword: ''})
  const user = useSelector((state) => state.users.userData)
  const [elements, setElements] = useState({data: []})
  const [t] = useTranslation('translation', { keyPrefix: 'user.ngo.shelters'})
  const vendorTemplateContent = {
    searchLabel: t('searchInputTitle'),
    bannerImage: 'url(/assets/user/image-9.svg)',
    title: <div style={{maxWidth: '20rem'}}>{t('shelterBannerTitle')}</div>,
    types: [
      {
        id: 'shelters',
        card: 'company',
        url: '/shelters/',
        label: t('tabLabelShelters'),
      },
      {
        id: 'pets',
        url: '/pets/',
        card: 'product',
        label: t('tabLabelPets'),
      },
    ]
  }

  const loadElements = async (e) => {
    if(e) e.preventDefault()
    setElements({data: []})
    if(type == 'shelters'){
      let _filter = { role: `(u.role='shelter' OR u.role='ngo')` }
      if(filters?.keyword != '')
        _filter['keyword'] = `(u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
      const _vendors = await getUsers(_filter, 'full', user.id, page)
      setElements(_vendors);
    }else if(type == 'pets'){
      let _filter = {state: `p.state=1`}
      if(filters?.keyword != '')
        _filter['keyword'] = `(p.name LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
      const _products = await getPets(_filter, page, user?.id)
      setElements(_products)
    }
  }

  useEffect(() => {
    loadElements();
    dispatch(setHeader("user"));
  }, [page]);
  useEffect(() => {
    setFilters({keyword: ''})
    setPage({first: 0, page: 0, rows: 8})
  }, [type]);

  return <CategoryListing content={vendorTemplateContent} section={type} elements={elements} filters={filters} setFilters={setFilters} reloadElements={loadElements} page={page} setPage={setPage} />
}

export default Shelters