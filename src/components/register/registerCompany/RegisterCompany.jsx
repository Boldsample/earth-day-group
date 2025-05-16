import { useEffect, useState } from "react"
import { TabView, TabPanel } from "primereact/tabview"
import { useDispatch, useSelector } from "react-redux"
import CompanyStandardForm from "./CompanyStandardForm"
import CompanyDetailedForm from "./CompanyDetailedForm"
import { useParams } from "react-router"
import { setHeader } from "@store/slices/globalSlice"
import { getUser } from "@services/userServices"
import { useTranslation } from "react-i18next"

const RegisterCompany = ({create = false}) => {
  const dispatch = useDispatch()
  const { username, tab } = useParams()
  const [isDisabled, setIsDisabled] = useState(true)
  const user = useSelector((state) => state.users.userData)
  const [activeIndex, setActiveIndex] = useState(tab == 'materials' ? 1 : 0)
  const preRegisterUser = useSelector((state) => state.users.preRegisterUser)
  const [t] = useTranslation('translation', { keyPrefix: 'register.registerCompany' })
  const [userData, setUserData] = useState({ pick_up_from_home: false, images: [], materials: [] })

  useEffect(() => {
    activeIndex == 0 ? setIsDisabled(true) : setIsDisabled(false);
  }, [activeIndex]);
  useEffect(() => {
    dispatch(setHeader("register"))
    if (preRegisterUser) {
      setUserData({
        ...userData,
        role: "company",
        name: preRegisterUser.name || "",
        email: preRegisterUser.email || "",
        picture: preRegisterUser.picture || "",
      });
      return;
    }
    if(!create){
      const _username = username || user?.username
      getUser(_username, user?.id).then(data => {
        setUserData({
          role: "company",
          id: data?.id || "",
          lat: data?.lat || "",
          lng: data?.lng || "",
          nit: data?.nit || "",
          name: data?.name || "",
          phone: data?.phone || "",
          email: data?.email || "",
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
          <TabPanel header={activeIndex == 1 ? t('EditPreviousForm') : ""} leftIcon={activeIndex == 1 ? "pi pi-angle-left" : ""}>
            <CompanyStandardForm user={userData} setUser={setUserData} setActiveIndex={setActiveIndex} />
          </TabPanel>
          <TabPanel disabled={isDisabled}>
            <CompanyDetailedForm user={userData} setUser={setUserData} currentUserID={user?.id} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default RegisterCompany;
