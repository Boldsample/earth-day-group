import {useState, useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux"

import { getUsers } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import CategoryListing from "@ui/templates/categoryListing/CategoryListing"

const Vendors = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState({page: 0, rows: 8})
  const [filters, setFilters] = useState({keyword: ''})
  const user = useSelector((state) => state.users.userData)
  const [vendors, setVendors] = useState({total: 0, data: []})

  const loadVendors = async () => {
    let _filter = { role: `u.role='vendor'` }
    if(filters?.keyword != '')
      _filter['keyword'] = `(u.name LIKE '%${filters.keyword}%' OR u.description LIKE '%${filters.keyword}%')`
    const _vendors = await getUsers(_filter, 'full', user.id, page)
    setVendors(_vendors);
  };

  const vendorTemplateContent = {
		title: "MARKET PLACE",
    searchLabel: "Discover products",
		bannerImage: "url(/assets/user/image-7.svg)"
	
	}

  useEffect(() => {
    loadVendors();
    dispatch(setHeader("user"));
  }, []);

  return <CategoryListing content={vendorTemplateContent} category={vendors} reloadList={loadVendors}/>
}

export default Vendors