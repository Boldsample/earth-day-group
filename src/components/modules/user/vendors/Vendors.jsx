import {useState, useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from 'react-i18next'

import { getUsers } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import { getProducts } from '@services/productServices'
import CategoryListing from "@ui/templates/categoryListing/CategoryListing"

const Vendors = ({type}) => {
  const dispatch = useDispatch()
  const [reset, setReset] = useState(false)
  const [page, setPage] = useState({page: 0, rows: 8})
  const [elements, setElements] = useState({data: []})
  const [filters, setFilters] = useState({keyword: ''})
  const [t] = useTranslation('translation', { keyPrefix: 'user.vendors'})
  const user = useSelector((state) => state.users.userData)
  const vendorTemplateContent = {
    title: t('VendorsBannerTitle'),
    searchLabel: t('searchInputTitle'),
    bannerImage: 'url(/assets/user/image-7.svg)',
    types: [
      {
        id: 'vendors',
        card: 'company',
        url: '/market-place/',
        label: t('tabLabelVendorsText'),
      },
      {
        id: 'products',
        card: 'product',
        label:  t('tabLabelProductsText'),
        url: '/products/',
      },
    ],
    secondary: [
      {
        title: '100% Recycled',
        icon: '/assets/icons/recycleCompanyIcon1.svg',
      },
      {
        title: 'Eco Friendly',
        icon: '/assets/icons/recycleCompanyIcon2.svg',
      },
      {
        title: 'Sustainable Economy',
        icon: '/assets/icons/recycleCompanyIcon3.svg',
      },
    ]
  }

  const loadElements = async (e) => {
    if(e) e.preventDefault()
    setElements({data: []})
    if(type == 'vendors'){
      let _filter = { role: `(u.role='vendor' || u.role='social' || u.role='ngo')` }
      if(filters?.keyword != '')
        _filter['keyword'] = `(u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
      const _vendors = await getUsers(_filter, 'full', user.id, page)
      setElements(_vendors)
    }else if(type == 'products'){
      let _filter = {state: `p.state=1`}
      if(filters?.keyword != '')
        _filter['keyword'] = `(p.name LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
      const _products = await getProducts(_filter, page, user?.id)
      setElements(_products)
    }
  }

  useEffect(() => {
    dispatch(setHeader("user"))
  }, [user])
  useEffect(() => {
    loadElements()
    setReset(false)
  }, [page, reset])
  useEffect(() => {
    setFilters({keyword: ''})
    setPage({page: 0, rows: 8,})
  }, [type])

  return <CategoryListing content={vendorTemplateContent} section={type} elements={elements} filters={filters} setFilters={setFilters} setReset={setReset} reloadElements={loadElements} page={page} setPage={setPage} />
}

export default Vendors