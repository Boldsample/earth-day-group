import React from "react";
import "./registerUser.sass";
import { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import TextInput from "@ui/forms/textInput/TextInput";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider, set } from "react-hook-form";
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto";
import NumberInput from "@ui/forms/numberInput/NumberInput";
import TextAreaInput from "@ui/forms/textAreaInput/TextAreaInput";
import DropDownInput from "@ui/forms/dropDownInput/DropDownInput";
import PasswordInput from "@ui/forms/passwordInput/PasswordInput";
import CheckBoxInput from "@ui/forms/checkBoxInput/CheckBoxInput";
import { getUsersList } from "@store/slices/usersSlice";
import { createUser } from "../../../../services/userServices";
import FileUploadInput from "@ui/forms/fileUploadInput/FileUploadInput";

const RegisterUser = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user);
  const [photoFileBlob, setPhotoFileBlob] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: null,
      bio: "",
      location: "",
      password: "",
      confirmPassword: "",
      username: "",
      termsConditionsChecked: false,
      profilePhoto: "",
    },
  });

  useEffect(() => {
    dispatch(getUsersList());
  }, []);

  console.log(userInfo);

  const countries = [
    { name: "Colombia", code: "COL" },
    { name: "United States", code: "USA" },
    { name: "Ecuador", code: "ECU" },
    { name: "Peru", code: "PER" },
    { name: "Panama", code: "PAN" },
  ];

  const getFormErrorMessage = (fieldName) => {
    return (
      errors[fieldName] && (
        <small className="p-error">{errors[fieldName]?.message}</small>
      )
    );
  };

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

  const onSubmit = async (data) => {
    const cleanData = {
      name: data.name,
      email: data.email,
      username: data.username,
      location: data.location.name,
      bio: data.bio,
      phone: data.phoneNumber,
      password: data.password,
    };
    console.log(data);
    const response = await createUser(cleanData);
    console.log(response);
  };

  return (
    <div className="layout">
      <div className="main__content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="profile__container">
            <div className="profilePicture__container">
              <ProfilePhoto userPhoto={photoFileBlob} />
            </div>
            <div className="profileUpload__container">
              <h5 className="profileUpload__title">Profile Picture</h5>

              <FileUploadInput setPhotoFileBlob={setPhotoFileBlob} />
            </div>
          </div>
          <div className="registerInput__container-x2">
            <TextInput
              isRequired={true}
              labelName="Name"
              isEdit={true}
              getFormErrorMessage={getFormErrorMessage}
              control={control}
              inputName="name"
              placeHolderText="Complete Name*"
              width="100%"
              showLabel={false}
              rules={{
                maxLength: {
                  value: 20,
                  message: "El campo supera los 20 caracteres",
                },
                required: "*El campo es requerido.",
                pattern: {
                  value: /^\S/,
                  message: "No debe tener espacios al inicio",
                },
              }}
            />
            <TextInput
              isRequired={true}
              labelName="E-mail"
              isEdit={true}
              getFormErrorMessage={getFormErrorMessage}
              control={control}
              inputName="email"
              placeHolderText="E-mail*"
              width="100%"
              showLabel={false}
              rules={{
                maxLength: {
                  value: 60,
                  message: "El campo supera los 60 caracteres",
                },
                required: "*El campo es requerido.",
                pattern: {
                  value: /^\S/,
                  message: "No debe tener espacios al inicio",
                },
              }}
            />
          </div>
          <div className="registerInput__container-x2">
            <TextInput
              isRequired={true}
              labelName="Username"
              isEdit={true}
              getFormErrorMessage={getFormErrorMessage}
              control={control}
              inputName="username"
              placeHolderText="Username*"
              width="100%"
              showLabel={false}
              rules={{
                maxLength: {
                  value: 20,
                  message: "El campo supera los 20 caracteres",
                },
                required: "*El campo es requerido.",
                pattern: {
                  value: /^\S/,
                  message: "No debe tener espacios al inicio",
                },
              }}
            />
            <DropDownInput
              control={control}
              showLabel={false}
              labelName="Location"
              nameInput="location"
              isEdit={true}
              isRequired={true}
              // value={selectedCity} onChange={(e) => setSelectedCity(e.value)}
              options={countries}
              optionLabel="name"
              placeHolderText="Select a Country"
              className=""
              getFormErrorMessage={getFormErrorMessage}
            />
          </div>
          <TextAreaInput
            isRequired={false}
            labelName="Bio"
            isEdit={true}
            getFormErrorMessage={getFormErrorMessage}
            control={control}
            nameInput="bio"
            placeHolderText="Tell us about yourself"
            //  width="100%"
            showLabel={true}
            rules={{
              maxLength: {
                value: 50,
                message: "El campo supera los 50 caracteres",
              },
              required: "*El campo es requerido.",
              pattern: {
                value: /^\S/,
                message: "No debe tener espacios al inicio",
              },
            }}
          />
          <NumberInput
            isRequired={true}
            labelName="Phone Number"
            isEdit={true}
            getFormErrorMessage={getFormErrorMessage}
            control={control}
            nameInput="phoneNumber"
            placeHolderText="Phone Number*"
            width="100%"
            showLabel={true}
            rules={{
              maxLength: {
                value: 7,
                message: "El campo supera los 7 caracteres",
              },
              required: "*El campo es requerido.",
              pattern: {
                value: /^\S/,
                message: "No debe tener espacios al inicio",
              },
            }}
          />
          <div className="registerInput__container-x2">
            <PasswordInput
              isRequired={true}
              labelName="Password"
              isEdit={true}
              getFormErrorMessage={getFormErrorMessage}
              control={control}
              nameInput="password"
              placeHolderText="Enter password"
              width="100%"
              showLabel={true}
              maxLength={20}
              rules={{
                maxLength: {
                  value: 20,
                  message: "El campo supera los 20 caracteres",
                },
                required: "*El campo es requerido.",
                pattern: {
                  value: /^\S/,
                  message: "No debe tener espacios al inicio",
                },
              }}
            />
            <PasswordInput
              className="noLabel"
              isRequired={true}
              labelName="Confirm Password"
              isEdit={true}
              getFormErrorMessage={getFormErrorMessage}
              control={control}
              nameInput="confirmPassword"
              placeHolderText="Confirm Password"
              width="100%"
              showLabel={true}
              maxLength={20}
              rules={{
                maxLength: {
                  value: 20,
                  message: "El campo supera los 20 caracteres",
                },
                required: "*El campo es requerido.",
                pattern: {
                  value: /^\S/,
                  message: "No debe tener espacios al inicio",
                },
              }}
            />
          </div>
          <CheckBoxInput
            nameInput="termsConditionsChecked"
            control={control}
            rules={{ required: "Accept is required." }}
            getFormErrorMessage={getFormErrorMessage}
            checkBoxText="I've read and accept the terms & conditions."
          />
          <div className="p-field" style={{ marginBottom: "24px" }}>
            <Button label="Sign up" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
