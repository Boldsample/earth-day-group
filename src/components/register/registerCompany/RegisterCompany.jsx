import { useEffect, useState } from "react"
import { TabView, TabPanel } from "primereact/tabview"
import { useDispatch, useSelector } from "react-redux"
import CompanyStandardForm from "./CompanyStandardForm"
import CompanyDetailedForm from "./CompanyDetailedForm"
import { useParams } from "react-router"
import { setHeader } from "@store/slices/globalSlice"
import { getUser } from "@services/userServices"

const RegisterCompany = ({create = false}) => {
  const dispatch = useDispatch()
  const { username } = useParams()
  const [ID, setID] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDisabled, setIsDisabled] = useState(true)
  const user = useSelector((state) => state.users.userData)
  const [userData, setUserData] = useState({ pick_up_from_home: false, images: [], materials: [] })

  useEffect(() => {
    activeIndex == 0 ? setIsDisabled(true) : setIsDisabled(false);
  }, [activeIndex]);
  useEffect(() => {
    dispatch(setHeader("register"))
    if(!create){
      const _username = username || user?.username
      getUser(_username, user?.id).then(data => {
        setID(data?.id)
        setUserData({
          password: "",
          role: "company",
          lat: data?.lat || "",
          lng: data?.lng || "",
          nit: data?.nit || "",
          name: data?.name || "",
          phone: data?.phone || "",
          email: data?.email || "",
          password_confirmation: "",
          images: data?.images || [],
          picture: data?.picture || "",
          address: data?.address || "",
          website: data?.website || "",
          username: data?.username || "",
          materials: data?.materials || [],
          accept_terms: !!data?.accept_terms,
          description: data?.description || "",
          accept_policy: !!data?.accept_policy,
          pick_up_from_home: !!data?.pick_up_from_home,
        })
      })
    }
  }, []);

  return (
    <div className="layout">
      <img className="layout__background" src="/assets/register/image-2.svg" />
      <div className="main__content xpadding-1">
        <TabView className="fullwidth" activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          <TabPanel header={activeIndex == 1 ? "Edit previous form" : ""} leftIcon={activeIndex == 1 ? "pi pi-angle-left" : ""}>
            <CompanyStandardForm user={userData} setUser={setUserData} ID={ID} setActiveIndex={setActiveIndex} />
          </TabPanel>
          <TabPanel disabled={isDisabled}>
            <CompanyDetailedForm user={userData} setUser={setUserData} ID={ID} currentUserID={user?.id} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default RegisterCompany;
