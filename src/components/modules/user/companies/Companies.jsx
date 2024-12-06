import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from 'react-i18next'

import { getUsers } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import CategoryListing from "@ui/templates/categoryListing/CategoryListing"

const Companies = () => {
  const dispatch = useDispatch()
  const [elements, setElements] = useState({data: []})
  const [filters, setFilters] = useState({keyword: ''})
  const user = useSelector((state) => state.users.userData)
  const [page, setPage] = useState({first: 0, page: 0, rows: 8})
  const [t] = useTranslation('translation', { keyPrefix: 'user.companies'})

  const loadElements = async (e) => {
    if(e) e.preventDefault()
    setElements({data: []})
    let _filter = { role: `u.role='company'` }
    if(filters?.keyword != '')
      _filter['keyword'] = encodeURIComponent(`(u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`)
    const _companies = await getUsers(_filter, 'full', user.id, page)
    if(_companies?.data)
      setElements(_companies);
  }

  const companyTemplateContent = {
    bannerImage: "url(/assets/user/image-6.svg)",
    title: t('companyBannerTitle'),
    searchLabel: t('searchLabelText'),
    secondary: [
      {
        title: t('iconTitle1'),
        icon: '/assets/icons/recycleCompanyIcon1.svg',
      },
      {
        title: t('iconTitle2'),
        icon: '/assets/icons/recycleCompanyIcon2.svg',
      },
      {
        title: t('iconTitle3'),
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
