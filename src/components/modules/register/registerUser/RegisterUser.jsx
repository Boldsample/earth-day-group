import React from "react";
import "./registerUser.sass";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import NumberInput from "../../../ui/numberInput/NumberInput";
import TextInput from "../../../ui/textInput/TextInput";
import TextAreaInput from "../../../ui/textAreaInput/TextAreaInput";
import DropDownInput from "../../../ui/dropDownInput/DropDownInput";
import { useForm, FormProvider } from "react-hook-form";
import PasswordInput from "../../../ui/passwordInput/PasswordInput";
import CheckBoxInput from "../../../ui/checkBoxInput/CheckBoxInput";
import ProfilePhoto from "../../../ui/profilePhoto/ProfilePhoto";
import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addCleanData } from "../../../../store/slices/usersSlice";
import { getUsersList } from "../../../../store/slices/usersSlice";



const RegisterUser = () => {
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
      country: "",
      password: "",
      confirmPassword: "",
      username: "",
      termsConditionsChecked: false,
    },
  });
  
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => console.log(state.users))
  
  useEffect(()=>{
    dispatch(getUsersList('juan'))
  }, [])
  
  console.log(userInfo)
  // console.log(cleanData)

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

  // console.log(getValues());

  const onSubmit = (data) => console.log(data);

  return (
    <div className="layout">
      <div className="main__content">
        <div className="profile__container">
          <div className="profilePicture__container">
            <ProfilePhoto />
          </div>
		  <div className="profileUpload__container">
          <h5 className="profileUpload__title">Profile Picture</h5>
          <p>Click to upload</p>
		  </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              nameInput="country"
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
              isRequired={true}
              labelName="Password"
              isEdit={true}
              getFormErrorMessage={getFormErrorMessage}
              control={control}
              nameInput="confirmPassword"
              placeHolderText="Confirm Password"
              width="100%"
              showLabel={false}
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
