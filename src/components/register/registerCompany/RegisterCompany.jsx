import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { createUser } from "@services/userServices";
import { getUserData } from "@store/slices/usersSlice";
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto";
import { updateThankyou } from "@store/slices/globalSlice";
import GoBackButton from "@ui/buttons/goBackButton/GoBackButton";
import { TabView, TabPanel } from "primereact/tabview";
import FormOne from "./FormOne";
import FormTwo from "./FormTwo";

const RegisterCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sending, setSending] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const user = useSelector((state) => state.users.userData);
  const [photoFileBlob, setPhotoFileBlob] = useState(user?.picture);
  const [recyclableMaterials, setRecyclableMaterials] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  // const isActive = activeIndex == 0 ? setIsDisabled(true) : setIsDisabled(false);
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
  const onSubmit = async (data) => {
    // console.log(data);
    // if (await createUser({ ...user, ...data })) {
    //   dispatch(getUserData());
    //   dispatch(
    //     updateThankyou({
    //       title: "Congrats!",
    //       link: "/dashboard/",
    //       background: "image-1.svg",
    //       button_label: "Go to dashboard",
    //       content:
    //         "You’re all signed up! We send you a verification link send your provide email. Please verify your identity.",
    //     })
    //   );
    // }
  };

  useEffect(() => {
    activeIndex == 0 ? setIsDisabled(true) : setIsDisabled(false);
    // dispatch(getUsersList());
    // dispatch(getUserData(5));
  }, [activeIndex]);

  // const uploadInvoice = async (invoiceFile) => {
  //   let formData = new FormData();
  //   formData.append('invoiceFile', invoiceFile);

  //   const response = await fetch(`orders/${orderId}/uploadInvoiceFile`,
  //     {
  //       method: 'POST',
  //       body: formData
  //     },
  //   );
  // };

  // const invoiceUploadHandler = ( event ) => {

  //   const fileReader = new FileReader();
  //   fileReader.onload = (e) => {
  //     uploadInvoice(e.target.result);
  //   };
  //   fileReader.readAsDataURL(file);
  // };

  // console.log(getValues());
  // console.log(recyclableMaterials)
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
            <FormOne
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
            <FormTwo
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
