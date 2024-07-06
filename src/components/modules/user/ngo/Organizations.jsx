import {useState, useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux"

import { getUsers } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import { getProducts } from '@services/productServices'
import CategoryListing from "@ui/templates/categoryListing/CategoryListing"

const Organizations = ({type}) => {
  const dispatch = useDispatch()
  const [page, setPage] = useState({page: 0, rows: 8})
  const [filters, setFilters] = useState({keyword: ''})
  const user = useSelector((state) => state.users.userData)
  const [elements, setElements] = useState({total: 0, data: []})
  const vendorTemplateContent = {
    title: 'TOGETHER WE WILL BE THE CHANGE',
    bannerImage: 'url(/assets/user/image-10.svg)',
    secondary: [
      {
        title: 'We are on a mission to reshape the world through the power of recycling',
        icon: '/assets/icons/socialOrganizationIcon1.svg',
      },
    ],
  }

  const loadElements = async (e) => {
    if(e) e.preventDefault()
    setElements({data: []})
    let _filter = { role: `(u.role='social' OR u.role='ngo')` }
    if(filters?.keyword != '')
      _filter['keyword'] = `(u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
    const _social = await getUsers(_filter, 'full', user.id, page)
    setElements(_social)
  }

  useEffect(() => {
    loadElements();
    dispatch(setHeader("user"));
  }, [page]);
  useEffect(() => {
    setFilters({keyword: ''})
    setPage({page: 0, rows: 8})
  }, [type]);

  return <CategoryListing content={vendorTemplateContent} section={type} elements={elements} filters={filters} setFilters={setFilters} reloadElements={loadElements} page={page} setPage={setPage} />
}

export default Organizations