import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { Autocomplete } from "@react-google-maps/api"
import {
  TextInput,
  NumberInput,
  PasswordInput,
  TextAreaInput,
  CheckBoxInput,
  UploadPhotoInput,
} from "@ui/forms";

const CompanyStandardForm = ({ user, setUser, setActiveIndex }) => {
  const {
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
      nit: user?.nit || "",
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      picture: user?.picture || "",
      website: user?.website || "",
      address: user?.address || "",
      password: user?.password || "",
      description: user?.description || "",
      accept_terms: user?.accept_terms && true || false,
      password_confirmation: user?.password_confirmation || "",
    },
  })

  const setAutocomplete = autocomplete => window.autocomplete = autocomplete
  const onPlaceChanged = () => setValue('address', window?.autocomplete?.getPlace()?.formatted_address)
  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const onSubmit = async (data) => {
	setUser({ ...user, ...data })
    setActiveIndex(1)
  }

  return <form onSubmit={handleSubmit(onSubmit)}>
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
      <Autocomplete className="input__wrapper" onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
        <TextInput
          width="100%"
          isEdit={true}
          control={control}
          showLabel={false}
          isRequired={true}
          labelName="Address"
          nameInput="address"
          placeHolderText="Address*"
          getFormErrorMessage={getFormErrorMessage}
          rules={{
            required: "*El campo es requerido.",
            pattern: {
              value: /^\S/,
              message: "No debe tener espacios al inicio",
            },
          }}
        />
      </Autocomplete>
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
            value: 100,
            message: "El campo supera los 100 caracteres",
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
        nameInput="password"
        isRequired={!user?.id}
        placeHolderText="Enter password"
        getFormErrorMessage={getFormErrorMessage}
        rules={{
          maxLength: user?.id ? undefined : {
            value: 20,
            message: "El campo supera los 20 caracteres",
          },
          required: user?.id ? undefined : "*El campo es requerido.",
          pattern: user?.id ? undefined : {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            message:
              "Must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
          },
        }}
      />
      <PasswordInput
        width="100%"
        label="&nbsp;"
        maxLength={20}
        feedback={false}
        showLabel={true}
        control={control}
        className="noLabel"
        isRequired={!user?.id}
        nameInput="password_confirmation"
        placeHolderText="Confirm Password"
        getFormErrorMessage={getFormErrorMessage}
        rules={{
          required: user?.id ? undefined : "*El campo es requerido.",
          validate: value => value === getValues().password || "The password doesn't match",
        }}
      />
    </div>
    <div className="p-field" style={{ marginBottom: "24px" }}>
      <CheckBoxInput
        control={control}
        nameInput="accept_terms"
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
}

export default CompanyStandardForm