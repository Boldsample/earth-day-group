import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GoBackButton from "@ui/buttons/goBackButton/GoBackButton";
import { TabView, TabPanel } from "primereact/tabview";
import CompanyStandardForm from "./CompanyStandardForm";
import CompanyDetailedForm from "./CompanyDetailedForm";

const RegisterCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  const user = useSelector((state) => state.users.userData);
  const [recyclableMaterials, setRecyclableMaterials] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    activeIndex == 0 ? setIsDisabled(true) : setIsDisabled(false);
    // dispatch(getUsersList());
    // dispatch(getUserData(5));
  }, [activeIndex]);

  return (
    <div className="layout">
      <img className="layout__background" src="/assets/register/image-2.svg" />
      <div className="main__content halfwidth">
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel
            header={activeIndex == 1 ? "Edit previous form" : ""}
            leftIcon={activeIndex == 1 ? "pi pi-angle-left" : ""}
          >
            <CompanyStandardForm
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              setIsDisabled={setIsDisabled}
            />
          </TabPanel>
          <TabPanel disabled={isDisabled}>
            <CompanyDetailedForm
                setRecyclableMaterials={setRecyclableMaterials}
                recyclableMaterials={recyclableMaterials}
                uploadedImages={uploadedImages}
                setUploadedImages={setUploadedImages}
            />
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
