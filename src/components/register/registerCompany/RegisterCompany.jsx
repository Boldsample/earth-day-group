import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { TabView, TabPanel } from "primereact/tabview"
import CompanyStandardForm from "./CompanyStandardForm"
import CompanyDetailedForm from "./CompanyDetailedForm"
import GoBackButton from "@ui/buttons/goBackButton/GoBackButton"

const RegisterCompany = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDisabled, setIsDisabled] = useState(true)
  const [userData, setUserData] = useState({ pick_up_from_home: false, images: [], recyclableMaterials: [] })

  useEffect(() => {
    activeIndex == 0 ? setIsDisabled(true) : setIsDisabled(false);
  }, [activeIndex]);
  console.log(userData)

  return (
    <div className="layout">
      <img className="layout__background" src="/assets/register/image-2.svg" />
      <div className="main__content halfwidth">
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          <TabPanel header={activeIndex == 1 ? "Edit previous form" : ""} leftIcon={activeIndex == 1 ? "pi pi-angle-left" : ""}>
            <CompanyStandardForm user={userData} setUser={setUserData} setActiveIndex={setActiveIndex} />
          </TabPanel>
          <TabPanel disabled={isDisabled}>
            <CompanyDetailedForm user={userData} setUser={setUserData} />
          </TabPanel>
        </TabView>
      </div>
      <Link to="/register/categories/">
        <GoBackButton />
      </Link>
    </div>
  );
};

export default RegisterCompany;
