import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { Autocomplete } from "@react-google-maps/api"
import { useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"

import { setHeader } from "@store/slices/globalSlice"
import { getUserData } from "@store/slices/usersSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import { createUser, getUser, updateUser } from "@services/userServices"
import { TextInput, NumberInput, PasswordInput, CheckBoxInput, RadioInput, UploadPhotoInput, TextAreaInput } from "@ui/forms"

import "./style.sass"

const RegisterVendor = ({create = false}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { username } = useParams()
  const [ID, setID] = useState(null)
  const [sending, setSending] = useState(false)
  const user = useSelector((state) => state.users.userData)
  const {
    watch,
    reset,
    control,
    setValue,
    setFocus,
    setError,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      lat: "",
      lng: "",
      name: "",
      phone: "",
      email: "",
      website: "",
      picture: "",
      address: "",
      username: "",
      password: "",
      role: "vendor",
      description: "",
      accept_terms: false,
      accept_policy: false,
      delivery_charges: "",
      pick_up_from_home: 0,
      delivery_available: 0,
      password_confirmation: "",
    },
  })

  const setAutocomplete = autocomplete => window.autocomplete = autocomplete
  const onPlaceChanged = e => {
    setValue('address', window?.autocomplete?.getPlace()?.formatted_address)
    setValue('lat', window?.autocomplete?.getPlace()?.geometry?.location?.lat())
    setValue('lng', window?.autocomplete?.getPlace()?.geometry?.location?.lng())
  }
  const radioData = [
    { name: "YES", value: 1 },
    { name: "NO", value: 0 },
  ]
  
  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const onSubmit = async (data) => {
    let response
    setSending(true)
    if(ID){
      if(data.password == '')
        delete data.password
      delete data.password_confirmation
      response = await updateUser({ ...data }, {id: ID}, ID)
    }else{
      delete data.password_confirmation
      response = await createUser({ ...data })
    }
    setSending(false)
    if(response?.id == user?.id)
      dispatch(getUserData(response?.id))
    if(ID && response?.id){
      dispatch(updateThankyou({
        title: "Updated successfully!",
        link: username ? "/users/" : "/dashboard/",
        background: "image-1.svg",
        button_label: username ? "Go back to admins" : "Go to dashboard",
        content: "The profile has been updated successfully!",
      }))
      navigate('/thankyou/')
    }else if(response?.id){
      dispatch(updateThankyou({
        title: "Congrats!",
        link: "/dashboard/",
        background: "image-1.svg",
        button_label: "Go to dashboard",
        content: "You’re all signed up! We send you a verification email. Please verify your identity.",
      }))
      navigate('/thankyou/')
    }else{
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
      return
    }
  }

  useEffect(() => {
    dispatch(setHeader("register"))
    if(!create){
      const _username = username || user?.username
      getUser(_username, user?.id).then(data => {
        setID(data?.id)
        reset({
          password: "",
          role: "vendor",
          lat: data?.lat || "",
          lng: data?.lng || "",
          name: data?.name || "",
          phone: data?.phone || "",
          email: data?.email || "",
          password_confirmation: "",
          website: data?.website || "",
          picture: data?.picture || "",
          address: data?.address || "",
          username: data?.username || "",
          description: data?.description || "",
          delivery_charges: data?.delivery_charges || "",
          pick_up_from_home: parseInt(data?.pick_up_from_home) || 0,
          delivery_available: parseInt(data?.delivery_available) || 0,
        })
      })
    }
  }, []);

  return <div className="layout">
    <img className="layout__background" src="/assets/register/image-2.svg" />
    <div className="main__content xpadding-1">
      <form onSubmit={handleSubmit(onSubmit)} className="fullwidth">
        <UploadPhotoInput
          watch={watch}
          control={control}
          setError={setError}
          setValue={setValue}
          getValues={getValues}
          type="profilePhotoUpload" />
        <div className="registerInput__container-x2">
          <TextInput
            disabled={ID}
            control={control}
            isRequired={true}
            labelName="Username"
            nameInput="username"
            placeHolderText="Username*"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 50,
                message: "The field exceeds 50 characters.",
              },
              required: "*The field is required.",
              pattern: {
                value: /^[a-zA-Z_]+$/,
                message: "It must have only letters and underscore.",
              },
            }} />
          <TextInput
            control={control}
            nameInput="email"
            isRequired={true}
            labelName="E-mail"
            placeHolderText="E-mail*"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 60,
                message: "The field exceeds 60 characters.",
              },
              required: "*The field is required.",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid e-mail address.",
              },
            }} />
        </div>
        <div className="registerInput__container-x2">
          <TextInput
            nameInput="name"
            control={control}
            isRequired={true}
            labelName="Shop Name"
            placeHolderText="Shop Name*"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 100,
                message: "The field exceeds 100 characters.",
              },
              required: "*The field is required.",
              pattern: {
                value: /^\S/,
                message: "It must not have spaces at the beginning.",
              },
            }} />
          <Autocomplete className="input__wrapper" onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
            <TextInput
              control={control}
              isRequired={true}
              autocomplete="off"
              labelName="Address"
              nameInput="address"
              placeHolderText="Address*"
              getFormErrorMessage={getFormErrorMessage}
              onKeyDown={e => { if(e.key == 'Enter') e.preventDefault() }}
              rules={{
                required: "*The field is required.",
                pattern: {
                  value: /^\S/,
                  message: "It must not have spaces at the beginning.",
                },
              }} />
          </Autocomplete>
        </div>
        <div className="registerInput__container-x2">
          <TextInput
            control={control}
            isRequired={true}
            labelName="Website"
            nameInput="website"
            placeHolderText="Website"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 100,
                message: "The field exceeds 50 characters.",
              },
              pattern: {
                value: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?(\/[a-zA-Z0-9-_?=&]+)?$/,
                message: "Please enter a valid website url",
              },
            }} />
          <NumberInput
            isRequired={true}
            control={control}
            nameInput="phone"
            labelName="Phone Number"
            placeHolderText="Phone Number*"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 16,
                message: "The field exceeds 16 characters.",
              },
              required: "*The field is required.",
              pattern: {
                value: /^[0-9+]+$/,
                message: "Please enter a valid phone number.",
              },
            }} />
        </div>
        <div className="registerInput__container-x2">
          <div className="fullwidth">
            <RadioInput
              data={radioData}
              control={control}
              isRequired={true}
              labelName="Delivery Available"
              nameInput="delivery_available"
              rules={{
                required: true,
              }} />
            {!!watch('delivery_available') && 
              <NumberInput
                showLabel={false}
                control={control}
                label="Delivery Charges"
                nameInput="delivery_charges"
                placeHolderText="Delivery Charges*"
                isRequired={watch('delivery_available')}
                getFormErrorMessage={getFormErrorMessage}
                rules={{
                  maxLength: {
                    value: 12,
                    message: "El campo supera los 7 caracteres",
                  },
                  required: watch('delivery_available') ? "*El campo es requerido." : false,
                  pattern: {
                    value: /^\S/,
                    message: "No debe tener espacios al inicio",
                  },
                }} />
            }
          </div>
          <div className="fullwidth">
            <RadioInput
              data={radioData}
              showLabel={true}
              control={control}
              isRequired={true}
              labelName="Self Pickup"
              nameInput="pick_up_from_home"
              rules={{
                required: true,
              }} />
          </div>
        </div>
        <div className="registerInput__container-x1">
          <TextAreaInput
            control={control}
            isRequired={false}
            labelName="Shop Detail"
            nameInput="description"
            placeHolderText="Tell us about the shop"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 1000,
                message: "The field exceeds 1000 characters.",
              },
              pattern: {
                value: /^\S/,
                message: "It must not have spaces at the beginning.",
              },
            }} />
        </div>
        {!username && <>
          <div className="registerInput__container-x2">
            <PasswordInput
              maxLength={20}
              isRequired={!ID}
              control={control}
              labelName="Password"
              nameInput="password"
              placeHolderText="Enter password"
              getFormErrorMessage={getFormErrorMessage}
              rules={{
                maxLength: {
                  value: 20,
                  message: "The field exceeds 20 characters.",
                },
                required: username ? undefined : "*The field is required.",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  message:
                    "Must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
                },
              }} />
            <PasswordInput
              maxLength={20}
              feedback={false}
              showLabel={true}
              isRequired={!ID}
              control={control}
              className="noLabel"
              labelName="Confirm pasword"
              nameInput="password_confirmation"
              placeHolderText="Confirm Password"
              getFormErrorMessage={getFormErrorMessage}
              rules={{
                required: user?.id ? undefined : "*El campo es requerido.",
                validate: value => value === getValues().password || "The password doesn't match",
              }} />
          </div>
          {!ID && 
            <div className="p-field mb-2">
              <div className="mb-1">
                <CheckBoxInput
                  control={control}
                  nameInput="accept_terms"
                  rules={{ required: "Accept is required." }}
                  getFormErrorMessage={getFormErrorMessage}
                  checkBoxText={<span>I've read and accept the <Link to="/terms-of-service/" target="_blank">Terms of Service</Link>.</span>} />
              </div>
              <div>
                <CheckBoxInput
                  control={control}
                  nameInput="accept_policy"
                  rules={{ required: "Accept is required." }}
                  getFormErrorMessage={getFormErrorMessage}
                  checkBoxText={<span>I've read and accept the <Link to="/privacy-policy/" target="_blank">Privacy Policy</Link>.</span>} />
              </div>
            </div>
          }
        </>}
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
          <Button className="dark-blue fullwidth" label={user?.id ? "Save" : "Sign up"} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default RegisterVendor