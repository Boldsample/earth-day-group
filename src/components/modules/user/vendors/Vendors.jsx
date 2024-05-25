import React, {useState, useEffect} from 'react'
import CategoryListing from "@ui/templates/categoryListing/CategoryListing"
import { useDispatch } from "react-redux";
import { getUsers } from "@services/userServices";
import { setHeader } from "@store/slices/globalSlice";

const Vendors = () => {
  const dispatch = useDispatch();
  const [vendors, setVendors] = useState([]);

  const loadVendors = async (filter = { role: "vendor" }) => {
    let _vendors = await getUsers(filter);
    setVendors(_vendors);
  };

  const vendorTemplateContent = {
		title: "MARKET PLACE",
		bannerImage: "url(/assets/user/image-7.svg) no-repeat center bottom"
	
	}

  useEffect(() => {
    loadVendors();
    dispatch(setHeader("user"));
  }, []);

  return (
    <>
        <CategoryListing content={vendorTemplateContent} category={vendors}/>
    </>
  )
}

export default Vendors