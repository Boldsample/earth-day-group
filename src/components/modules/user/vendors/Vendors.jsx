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
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})
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
        url: '/market-place/products/',
      },
    ],
    secondary: [
      {
        title: tGlobal('categoryListingiconTitle1'),
        icon: '/assets/icons/recycleCompanyIcon1.svg',
      },
      {
        title: tGlobal('categoryListingiconTitle2'),
        icon: '/assets/icons/recycleCompanyIcon3.svg',
      },
      {
        title: tGlobal('categoryListingiconTitle3'),
		    icon: '/assets/icons/recycleCompanyIcon2.svg',
      },
    ]
  }

  const loadElements = async (e = false) => {
    //if(e) e.preventDefault()
    if(!e)
      setElements({data: []})
    if(type == 'vendors'){
      let _filter = { role: `(u.role='vendor' || u.role='social' || u.role='ngo')` }
      if(filters?.keyword != '')
        _filter['keyword'] = encodeURIComponent(`(u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`)
      const _vendors = await getUsers(_filter, 'full', user.id, page)
      if(_vendors?.data)
        setElements(_vendors)
    }else if(type == 'products'){
      let _filter = {state: `p.state=1`}
      if(filters?.keyword != '')
        _filter['keyword'] = encodeURIComponent(`(p.name LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`)
      const _products = await getProducts(_filter, page, user?.id)
      if(_products?.data)
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
    setPage({first: 0, page: 0, rows: 8,})
  }, [type])

  return <CategoryListing content={vendorTemplateContent} section={type} elements={elements} filters={filters} setFilters={setFilters} setReset={setReset} reloadElements={loadElements} page={page} setPage={setPage} />
}

export default Vendors