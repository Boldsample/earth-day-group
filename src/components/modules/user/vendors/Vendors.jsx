import {useState, useEffect} from 'react'
import { useLocation } from 'react-router'
import { useDispatch, useSelector } from "react-redux"

import { getUsers } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import { getProducts } from '@services/productServices'
import CategoryListing from "@ui/templates/categoryListing/CategoryListing"

const Vendors = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [page, setPage] = useState({page: 0, rows: 8})
  const [filters, setFilters] = useState({keyword: ''})
  const user = useSelector((state) => state.users.userData)
  const [elements, setElements] = useState({total: 0, data: []})

  const loadElements = async (e) => {
    if(e) e.preventDefault()
    if(location.pathname == '/vendors/'){
      let _filter = { role: `u.role='vendor'` }
      if(filters?.keyword != '')
        _filter['keyword'] = `(u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
      const _vendors = await getUsers(_filter, 'full', user.id, page)
      setElements(_vendors);
    }else if(location.pathname == '/products/'){
      let _filter = {}
      if(filters?.keyword != '')
        _filter['keyword'] = `(p.name LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
      const _products = await getProducts(_filter, page, user?.id)
      setElements(_products)
    }
  }

  const vendorTemplateContent = {
    title: 'MARKET PLACE',
    searchLabel: 'Discover products',
    bannerImage: 'url(/assets/user/image-7.svg)',
    types: [
      {
        card: 'company',
        url: '/vendors/',
        label: 'Vendors',
      },
      {
        card: 'product',
        label: 'Products',
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

  useEffect(() => {
    loadElements();
    dispatch(setHeader("user"));
  }, [page]);
  useEffect(() => {
    setFilters({keyword: ''})
    setPage({page: 0, rows: 8})
  }, [location]);

  return <CategoryListing content={vendorTemplateContent} elements={elements} filters={filters} setFilters={setFilters} reloadElements={loadElements} page={page} setPage={setPage} />
}

export default Vendors