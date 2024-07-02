import { getProducts } from "@services/productServices"
import { setHeader } from "@store/slices/globalSlice"
import CategoryListing from "@ui/templates/categoryListing/CategoryListing"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router"

const Bookmarks = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [page, setPage] = useState({page: 0, rows: 8})
  const [filters, setFilters] = useState({keyword: ''})
  const user = useSelector((state) => state.users.userData)
  const [elements, setElements] = useState({total: 0, data: []})
  const bookmarksTemplateContent = {
    title: location.pathname == '/bookmarks/' ? 'Saved products' : 'Favorite pets',
    bannerImage: location.pathname == '/bookmarks/' ? 'url(/assets/user/image-8.svg)' : 'url(/assets/user/image-9.svg)',
    types: [
      {
        card: 'product',
        label: 'Saved products',
        url: '/bookmarks/',
      },
      {
        card: 'products',
        url: '/bookmarks/pets/',
        label: 'Favorit pets',
      },
    ]
  }

  const loadElements = async (e) => {
    if(e) e.preventDefault()
    if(location.pathname == '/bookmarks/'){
      let _filter = { 'bookmarks': `f.date IS NOT NULL` }
      if(filters?.keyword != '')
        _filter['keyword'] = `(p.name LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
      const _products = await getProducts(_filter, page, user?.id)
      setElements(_products)
    }else if(location.pathname == '/bookmarks/pets/'){
      let _filter = { 'bookmarks': `f.date IS NOT NULL` }
      if(filters?.keyword != '')
        _filter['keyword'] = `(p.name LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
      const _products = await getProducts(_filter, page, user?.id)
      setElements(_products)
    }
  }

  useEffect(() => {
    loadElements();
    dispatch(setHeader("user"));
  }, [page]);
  useEffect(() => {
    setFilters({keyword: ''})
    setPage({page: 0, rows: 8})
  }, [location]);

  return <CategoryListing content={bookmarksTemplateContent} elements={elements} filters={filters} setFilters={setFilters} reloadElements={loadElements} page={page} setPage={setPage} />
}

export default Bookmarks