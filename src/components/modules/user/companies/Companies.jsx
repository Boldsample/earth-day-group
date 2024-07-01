import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { getUsers } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import CategoryListing from "@ui/templates/categoryListing/CategoryListing"

const Companies = () => {
  const dispatch = useDispatch()
  const [page, setPage] = useState({page: 0, rows: 8})
  const [filters, setFilters] = useState({keyword: ''})
  const user = useSelector((state) => state.users.userData)
  const [elements, setElements] = useState({total: 0, data: []})

  const loadElements = async (e) => {
    if(e) e.preventDefault()
    let _filter = { role: `u.role='company'` }
    if(filters?.keyword != '')
      _filter['keyword'] = `(u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
    const _companies = await getUsers(_filter, 'full', user.id, page)
    setElements(_companies);
  }

  const companyTemplateContent = {
		bannerImage: "url(/assets/user/image-6.svg)",
		title: "HELP THE PLANET AND HELP YOUR POCKET",
    searchLabel: 'Discover recycle companies',
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

  return <CategoryListing content={companyTemplateContent} elements={elements} filters={filters} setFilters={setFilters} reloadElements={loadElements} page={page} setPage={setPage} />
}

export default Companies;
