import { useEffect, useState } from "react"
import { setHeader } from "@store/slices/globalSlice"
import { useDispatch, useSelector } from "react-redux"
import { getProducts } from "@services/productServices"
import CategoryListing from "@ui/templates/categoryListing/CategoryListing"
import { getPets } from "@services/petServices"
import { useTranslation } from 'react-i18next'
import { getUsers } from "@services/userServices"

const Bookmarks = ({type}) => {
  const dispatch = useDispatch()
  const [page, setPage] = useState({page: 0, rows: 8})
  const [elements, setElements] = useState({data: []})
  const [filters, setFilters] = useState({keyword: ''})
  const user = useSelector((state) => state.users.userData)
  const [t] = useTranslation('translation', { keyPrefix: 'bookmarks' })
  const bookmarksTemplateContent = {
    title: type == 'products' ? t('savedProductsBannerTitle') : t('favoritePetsBannerTitle'),
    bannerImage: type == 'products' ? 'url(/assets/user/image-8.svg)' : 'url(/assets/user/image-9.svg)',
    types: [
      {
        id: 'products',
        card: 'product',
        label: t('savedProductsBannerTitle'),
        url: '/bookmarks/products/saved/',
      },
      {
        id: 'pets',
        card: 'products',
        url: '/bookmarks/pets/favorite/',
        label: t('favoritePetsBannerTitle'),
      },
      {
        id: 'following',
        card: 'company',
        url: '/bookmarks/profiles/following/',
        label: t('profilesFollowingBannerTitle'),
      },
    ]
  }

  const loadElements = async (e) => {
    if(e) e.preventDefault()
	setElements({data: []})
    if(type == 'following'){
      let _filter = {
        user: `u.id<>'${user?.id}'`,
        type: `f.follower='${user?.id}'`
      }
      if(filters?.keyword != '')
        _filter['keyword'] = encodeURIComponent(`(u.name LIKE '%${filters.keyword}%' OR u.email LIKE '%${filters.keyword}%')`)
        const _following = await getUsers(_filter, 'full', user?.id, page)
        if(_following?.data)
          setElements(_following)
    }
    if(type == 'products'){
      let _filter = { 'bookmarks': `f.type='product' AND f.date IS NOT NULL AND p.state=1` }
      if(filters?.keyword != '')
        _filter['keyword'] = encodeURIComponent(`(p.name LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`)
      const _products = await getProducts(_filter, page, user?.id)
      if(_products?.data)
        setElements(_products)
    }else if(type == 'pets'){
      let _filter = { 'bookmarks': `f.type='pet' AND f.date IS NOT NULL AND p.state=1` }
      if(filters?.keyword != '')
        _filter['keyword'] = encodeURIComponent(`(p.name LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`)
      const _pets = await getPets(_filter, page, user?.id)
      if(_pets?.data)
        setElements(_pets)
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

  return <CategoryListing content={bookmarksTemplateContent} section={type} elements={elements} filters={filters} setFilters={setFilters} reloadElements={loadElements} page={page} setPage={setPage} />
}

export default Bookmarks