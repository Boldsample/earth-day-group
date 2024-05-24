import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import CategoryListing from "@ui/templates/categoryListing/CategoryListing";
import { getUsers } from "@services/userServices";
import { setHeader } from "@store/slices/globalSlice";

import "./styles.sass";


const Companies = () => {
   const dispatch = useDispatch();
  const [companies, setCompanies] = useState([]);

  const loadCompanies = async (filter = { role: "company" }) => {
    let _companies = await getUsers(filter);
    setCompanies(_companies);
  };

  const companyTemplateContent = {
		title: "HELP THE PLANET AND HELP YOUR POCKET",
		bannerImage: "url(/assets/user/image-6.svg) no-repeat center bottom"
	
	}

  useEffect(() => {
    loadCompanies();
    dispatch(setHeader("user"));
  }, []);
console.log(companies)
  return (
    <>
        <CategoryListing content={companyTemplateContent} category={companies}/>
    </>
  )
}

export default Companies;
