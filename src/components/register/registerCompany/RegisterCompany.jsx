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
  const [photoFileBlob, setPhotoFileBlob] = useState(user?.picture);
  const [recyclableMaterials, setRecyclableMaterials] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const {
    reset,
    watch,
    control,
    setValue,
    setError,
    getValues,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: "",
      phone: null,
      location: "",
      password: "",
      companyName: user?.name,
      email: user?.email,
      picture: user?.picture,
      password_confirmation: "",
      termsConditionsChecked: false,
      materials: "",
      unit: "",
      unitPrice: null,
      bio: "",
    },
  });

  const getFormErrorMessage = (fieldName) =>
    errors[fieldName] && (
      <small className="p-error">{errors[fieldName]?.message}</small>
    );

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
              watch={watch}
              control={control}
              setError={setError}
              setValue={setValue}
              getValues={getValues}
              getFormErrorMessage={getFormErrorMessage}
              setIsDisabled={setIsDisabled}
            />
          </TabPanel>
          <TabPanel disabled={isDisabled}>
            <CompanyDetailedForm
              control={control}
              setError={setError}
              clearErrors={clearErrors}
              photoFileBlob={photoFileBlob}
              getFormErrorMessage={getFormErrorMessage}
              setPhotoFileBlob={setPhotoFileBlob}
              getValues={getValues}
              recyclableMaterials={recyclableMaterials}
              setRecyclableMaterials={setRecyclableMaterials}
              reset={reset}
              setValue={setValue}
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
