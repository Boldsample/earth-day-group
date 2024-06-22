import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { getUsers } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import CategoryListing from "@ui/templates/categoryListing/CategoryListing"



const Companies = () => {
   const dispatch = useDispatch();
  const [companies, setCompanies] = useState([]);

  const loadCompanies = async (filter = { role: "company" }) => {
    let _companies = await getUsers(filter, 'full');
    setCompanies(_companies);
  };

  const companyTemplateContent = {
		bannerImage: "url(/assets/user/image-6.svg)",
		title: "HELP THE PLANET AND HELP YOUR POCKET",
	
	}

  useEffect(() => {
    loadCompanies();
    dispatch(setHeader("user"));
  }, []);

  return (
    <>
        <CategoryListing content={companyTemplateContent} category={companies}/>
    </>
  )
}

export default Companies;
