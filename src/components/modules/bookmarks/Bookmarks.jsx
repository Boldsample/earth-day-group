import { useEffect, useState } from "react"
import { setHeader } from "@store/slices/globalSlice"
import { useDispatch, useSelector } from "react-redux"
import { getProducts } from "@services/productServices"
import CategoryListing from "@ui/templates/categoryListing/CategoryListing"
import { getPets } from "@services/petServices"
import { useTranslation } from 'react-i18next'

const Bookmarks = ({type}) => {
  const dispatch = useDispatch()
  const [page, setPage] = useState({page: 0, rows: 8})
  const [filters, setFilters] = useState({keyword: ''})
  const user = useSelector((state) => state.users.userData)
  const [elements, setElements] = useState({total: 0, data: []})
  const [t] = useTranslation('translation', { keyPrefix: 'bookmarks' })
  const bookmarksTemplateContent = {
    title: type == 'products' ? t('savedProductsBannerTitle') : t('favoritePetsBannerTitle'),
    bannerImage: type == 'products' ? 'url(/assets/user/image-8.svg)' : 'url(/assets/user/image-9.svg)',
    types: [
      {
        id: 'products',
        card: 'product',
        label: t('savedProductsBannerTitle'),
        url: '/products/saved/',
      },
      {
        id: 'pets',
        card: 'products',
        url: '/pets/favorite/',
        label: t('favoritePetsBannerTitle'),
      },
    ]
  }

  const loadElements = async (e) => {
    if(e) e.preventDefault()
    if(type == 'products'){
      let _filter = { 'bookmarks': `f.type='product' AND f.date IS NOT NULL AND p.state=1` }
      if(filters?.keyword != '')
        _filter['keyword'] = `(p.name LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
      const _products = await getProducts(_filter, page, user?.id)
      setElements(_products)
    }else if(type == 'pets'){
      let _filter = { 'bookmarks': `f.type='pet' AND f.date IS NOT NULL AND p.state=1` }
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
    setPage({page: 0, rows: 8})
  }, [type]);

  return <CategoryListing content={bookmarksTemplateContent} section={type} elements={elements} filters={filters} setFilters={setFilters} reloadElements={loadElements} page={page} setPage={setPage} />
}

export default Bookmarks