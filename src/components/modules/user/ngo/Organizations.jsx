import {useState, useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from 'react-i18next'

import { getUsers } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import { getProducts } from '@services/productServices'
import CategoryListing from "@ui/templates/categoryListing/CategoryListing"

const Organizations = ({type}) => {
  const dispatch = useDispatch()
  const [page, setPage] = useState({page: 0, rows: 8})
  const [elements, setElements] = useState({data: []})
  const [filters, setFilters] = useState({keyword: ''})
  const user = useSelector((state) => state.users.userData)
  const [t] = useTranslation('translation', { keyPrefix: 'user.ngo.organizations'})
  const vendorTemplateContent = {
    title: t('bannerTitle'),
    bannerImage: 'url(/assets/user/image-10.svg)',
    secondary: [
      {
        title: t('bannerSubTitle'),
        icon: '/assets/icons/socialOrganizationIcon1.svg',
      },
    ],
  }

  const loadElements = async (e = false) => {
    //if(e) e.preventDefault()
    if(!e)
      setElements({data: []})
    let _filter = { role: `(u.role='social' OR u.role='ngo')` }
    if(filters?.keyword != '')
      _filter['keyword'] = encodeURIComponent(`(u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`)
    const _social = await getUsers(_filter, 'full', user.id, page)
    if(_social?.data)
      setElements(_social)
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

export default Organizations