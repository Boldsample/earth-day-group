import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { storeUserRegistrationData } from "@store/slices/usersSlice";
import {
  TextInput,
  NumberInput,
  PasswordInput,
  TextAreaInput,
  DropDownInput,
  CheckBoxInput,
  FileUploadInput,
  UploadPhotoInput,
} from "@ui/forms";
import countries from "@json/countries.json";
const CompanyStandardForm = ({
  activeIndex,
  setActiveIndex,
  setIsDisabled,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.userData);
  const {
    reset,
    watch,
    control,
    setValue,
    setError,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "company",
      name: user?.company_name || "",
      nit: user?.nit || "",
      email: user?.email || "",
      website: user?.website || "",
      address: user?.address || "",
      phone: user?.phone || "",
      description: user?.description || "",
      password: user?.password || "",
      password_confirmation: user?.password_confirmation || "",
      terms_conditions_checked: user?.terms_conditions_checked || "",
      picture: user?.picture || "",
    },
  });

  const getFormErrorMessage = (fieldName) =>
    errors[fieldName] && (
      <small className="p-error">{errors[fieldName]?.message}</small>
    );

  const onSubmit = async (data) => {
    console.log(data);
    setActiveIndex(1);
    setIsDisabled(false);
    dispatch(
      storeUserRegistrationData({
        ...data,
      })
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <UploadPhotoInput
          watch={watch}
          control={control}
          setError={setError}
          setValue={setValue}
          getValues={getValues}
          type="profilePhotoUpload"
        />
        <div className="registerInput__container-x2">
          <TextInput
            isRequired={true}
            labelName="Company Name"
            isEdit={true}
            getFormErrorMessage={getFormErrorMessage}
            control={control}
            nameInput="name"
            placeHolderText="Company Name*"
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
            nameInput="email"
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
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid e-mail address",
              },
            }}
          />
        </div>
        <div className="registerInput__container-x2">
          <TextInput
            isRequired={true}
            labelName="NIT"
            isEdit={true}
            getFormErrorMessage={getFormErrorMessage}
            control={control}
            nameInput="nit"
            placeHolderText="NIT*"
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
            labelName="Website"
            isEdit={true}
            getFormErrorMessage={getFormErrorMessage}
            control={control}
            nameInput="website"
            placeHolderText="Website"
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
        </div>
        <div className="registerInput__container-x1">
          <TextInput
            isRequired={true}
            labelName="Address"
            isEdit={true}
            getFormErrorMessage={getFormErrorMessage}
            control={control}
            nameInput="address"
            placeHolderText="Street Address*"
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
        </div>
        <div className="registerInput__container-x1">
          <NumberInput
            disabled={false}
            width="100%"
            showLabel={true}
            isRequired={true}
            control={control}
            label="Phone Number"
            nameInput="phone"
            placeHolderText="Phone Number*"
            getFormErrorMessage={getFormErrorMessage}
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
        </div>
        <div className="registerInput__container-x1">
          <TextAreaInput
            label="Description"
            nameInput="description"
            showLabel={true}
            control={control}
            isRequired={false}
            placeHolderText="Tell us about your company"
            getFormErrorMessage={getFormErrorMessage}
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
        </div>
        <div className="registerInput__container-x2">
          <PasswordInput
            width="100%"
            maxLength={20}
            label="Password"
            showLabel={true}
            control={control}
            isRequired={true}
            nameInput="password"
            placeHolderText="Enter password"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 20,
                message: "El campo supera los 20 caracteres",
              },
              required: "*El campo es requerido.",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                message:
                  "Must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
              },
            }}
          />
          <PasswordInput
            label=""
            width="100%"
            maxLength={20}
            showLabel={true}
            control={control}
            isRequired={true}
            className="noLabel"
            nameInput="password_confirmation"
            placeHolderText="Confirm Password"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 20,
                message: "El campo supera los 20 caracteres",
              },
              required: "*El campo es requerido.",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                message:
                  "Must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
              },
            }}
          />
        </div>
        <div className="p-field" style={{ marginBottom: "24px" }}>
          <CheckBoxInput
            nameInput="terms_conditions_checked"
            control={control}
            rules={{ required: "Accept is required." }}
            getFormErrorMessage={getFormErrorMessage}
            checkBoxText="I've read and accept the terms & conditions."
          />
        </div>
        <div className="p-field" style={{ marginBottom: "24px" }}>
          <Button
            className="dark-blue fullwidth"
            label="Confirm"
            type="submit"
            name="submit"
          />
        </div>
      </form>
    </>
  );
};

export default CompanyStandardForm;
