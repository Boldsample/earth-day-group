import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { Autocomplete } from "@react-google-maps/api"

import { checkUser } from "@services/userServices"
import { TextInput, NumberInput, PasswordInput, TextAreaInput, CheckBoxInput, UploadPhotoInput } from "@ui/forms"

const CompanyStandardForm = ({ user, setUser, setActiveIndex }) => {
  const [sending, setSending] = useState(false)
  const {
    watch,
    control,
    setValue,
    setFocus,
    setError,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "company",
      lat: user?.lat || "",
      lng: user?.lng || "",
      nit: user?.nit || "",
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      picture: user?.picture || "",
      website: user?.website || "",
      address: user?.address || "",
      username: user?.username || "",
      password: user?.password || "",
      description: user?.description || "",
      accept_terms: user?.accept_terms && true || false,
      password_confirmation: user?.password_confirmation || "",
    },
  })

  const setAutocomplete = autocomplete => window.autocomplete = autocomplete
  const onPlaceChanged = e => {
    setValue('address', window?.autocomplete?.getPlace()?.formatted_address)
    setValue('lat', window?.autocomplete?.getPlace()?.geometry?.location?.lat())
    setValue('lng', window?.autocomplete?.getPlace()?.geometry?.location?.lng())
  }
  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const onSubmit = async (data) => {
    if(!user.id){
      setSending(true)
      const { email, username } = getValues()
      const response = await checkUser({ email, username })
      setSending(false)
      if(response?.field){
        setFocus(response.field)
        setError(response.field, { type: "manual", message: response.message })
        return
      }
    }
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
      type="profilePhotoUpload" />
    <div className="registerInput__container-x2">
      <TextInput
        width="100%"
        isEdit={true}
        nameInput="name"
        control={control}
        showLabel={false}
        isRequired={true}
        labelName="Company Name"
        placeHolderText="Company Name*"
        getFormErrorMessage={getFormErrorMessage}
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
        }} />
      <TextInput
        width="100%"
        isEdit={true}
        control={control}
        showLabel={false}
        nameInput="email"
        isRequired={true}
        labelName="E-mail"
        placeHolderText="E-mail*"
        getFormErrorMessage={getFormErrorMessage}
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
        width="100%"
        isEdit={true}
        control={control}
        showLabel={false}
        isRequired={true}
        labelName="Username"
        nameInput="username"
        placeHolderText="Username*"
        getFormErrorMessage={getFormErrorMessage}
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
        }} />
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
          onKeyDown={e => { if(e.key == 'Enter') e.preventDefault() }}
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
    <div className="registerInput__container-x2">
      <TextInput
        width="100%"
        isEdit={true}
        labelName="NIT"
        nameInput="nit"
        control={control}
        showLabel={false}
        isRequired={true}
        placeHolderText="NIT*"
        getFormErrorMessage={getFormErrorMessage}
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
        }}/>
      <TextInput
        width="100%"
        isEdit={true}
        control={control}
        showLabel={false}
        isRequired={true}
        labelName="Website"
        nameInput="website"
        placeHolderText="Website"
        getFormErrorMessage={getFormErrorMessage}
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
        }} />
    </div>
    <div className="registerInput__container-x1">
      <TextAreaInput
        showLabel={true}
        control={control}
        isRequired={false}
        label="Description"
        nameInput="description"
        getFormErrorMessage={getFormErrorMessage}
        placeHolderText="Tell us about your company"
        rules={{
          required: "*El campo es requerido.",
          pattern: {
            value: /^\S/,
            message: "No debe tener espacios al inicio",
          },
        }} />
    </div>
    <div className="registerInput__container-x1">
      <NumberInput
        width="100%"
        disabled={false}
        showLabel={true}
        nameInput="phone"
        isRequired={true}
        control={control}
        label="Phone Number"
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
        }} />
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
        }} />
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
        }} />
    </div>
    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
      <CheckBoxInput
        control={control}
        nameInput="accept_terms"
        rules={{ required: "Accept is required." }}
        getFormErrorMessage={getFormErrorMessage}
        checkBoxText="I've read and accept the terms & conditions." />
    </div>
    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
      <Button className="dark-blue fullwidth" label="Continue" type="submit" name="submit" loading={sending} />
    </div>
  </form>
}

export default CompanyStandardForm