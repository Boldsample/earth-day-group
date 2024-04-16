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
  const user = useSelector((state) => state.users.userData);
  const [photoFileBlob, setPhotoFileBlob] = useState(user?.picture);
  const [recyclableMaterials, setRecyclableMaterials] = useState([])
  const {
    reset,
    control,
    handleSubmit,
    getValues,
    setValue,
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
    console.log(data);
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
    // dispatch(getUsersList());
    // dispatch(getUserData(5));
  }, []);

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
  console.log(recyclableMaterials)
  return (
    <div className="layout">
      <img className="layout__background" src="/assets/register/image-2.svg" />
      <div className="main__content halfwidth">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TabView>
            <TabPanel>
              <FormOne
                control={control}
                getFormErrorMessage={getFormErrorMessage}
                photoFileBlob={photoFileBlob}
                setPhotoFileBlob={setPhotoFileBlob}
              />
            </TabPanel>
            <TabPanel>
              <FormTwo
                control={control}
                getFormErrorMessage={getFormErrorMessage}
                photoFileBlob={photoFileBlob}
                setPhotoFileBlob={setPhotoFileBlob}
                getValues={getValues}
                recyclableMaterials={recyclableMaterials}
                setRecyclableMaterials={setRecyclableMaterials}
                reset={reset}
                setValue={setValue}
              />
            </TabPanel>
          </TabView>

          <div className="p-field" style={{ marginBottom: "24px" }}>
            <Button
              className="dark-blue fullwidth"
              label="Sign up"
              type="submit"
            />
          </div>
        </form>
      </div>
      <Link to="/register/categories/">
        <GoBackButton />
      </Link>
    </div>
  );
};

export default RegisterCompany;
