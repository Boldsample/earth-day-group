import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { Autocomplete } from "@react-google-maps/api"
import { useDispatch, useSelector } from "react-redux"

import { getUserData } from "@store/slices/usersSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import { setHeader, setHeaderTitle } from "@store/slices/globalSlice"
import { addImages, createUser, updateUser } from "@services/userServices"
import { TextInput, NumberInput, PasswordInput, CheckBoxInput, RadioInput, UploadPhotoInput, TextAreaInput } from "@ui/forms"

import "./style.sass"

const RegisterVendor = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const user = useSelector((state) => state.users.userData)
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
      role: "vendor",
      password: "",
      lat: user?.lat || "",
      lng: user?.lng || "",
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      password_confirmation: "",
      images: user?.images || [],
      picture: user?.picture || "",
      address: user?.address || "",
      username: user?.username || "",
      description: user?.description || "",
      delivery_charges: user?.delivery_charges || "",
      pick_up_from_home: user?.pick_up_from_home || "",
      accept_terms: user?.accept_terms && true || false,
      delivery_available: user?.delivery_available || 0,
    },
  })

  const setAutocomplete = autocomplete => window.autocomplete = autocomplete
  const onPlaceChanged = e => {
    setValue('address', window?.autocomplete?.getPlace()?.formatted_address)
    setValue('lat', window?.autocomplete?.getPlace()?.geometry?.location?.lat())
    setValue('lng', window?.autocomplete?.getPlace()?.geometry?.location?.lng())
  }
  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>

  const radioData = [
    { name: "YES", value: 1 },
    { name: "NO", value: 0 },
  ]
  const setUploadedImages = (images) => {
    setValue('images', images)
  }
  const onSubmit = async (data) => {
    let response
    let _user = { ...user, ...data }
    delete _user.images
    setSending(true)
    if(user.id){
      if(_user.password == ''){
        delete _user.password
        delete _user.password_confirmation
      }
      response = await updateUser({ ..._user }, {id: user.id})
    }else{
      delete _user.password_confirmation
      response = await createUser({ ..._user })
    }
    if(response.field){
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
      setSending(false)
      return
    }
    const _sendImages = data.images.map(image => {
      let _image = {...image}
      _image.entity = response.id
      return _image
    })
    await addImages(_sendImages)
    setSending(false)
    if(user?.id && response?.id){
      dispatch(updateThankyou({
        title: "Updated successfully!",
        link: "/settings/",
        background: "image-1.svg",
        button_label: "Go back to settings",
        content: "Your profile has updated successfully!",
      }))
      navigate('/thankyou/')
    }else if(response.id){
      dispatch(updateThankyou({
        title: "Congrats!",
        link: "/dashboard/",
        background: "image-1.svg",
        button_label: "Go to dashboard",
        content: "You’re all signed up! We send you a verification link send your provide email. Please verify your identity.",
      }))
      navigate('/thankyou/')
    }
    dispatch(getUserData(response.id))
  }

  useEffect(() => {
    if(user?.id){
      dispatch(setHeader('settings'))
      dispatch(setHeaderTitle('Edit Profile'))
    }else
      dispatch(setHeader("register"));
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
            width="100%"
            nameInput="name"
            control={control}
            showLabel={false}
            isRequired={true}
            labelName="Shop Name"
            placeHolderText="Shop Name*"
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
            control={control}
            showLabel={false}
            nameInput="email"
            isRequired={true}
            labelName="Shop E-mail"
            placeHolderText="Shop E-mail*"
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
            }} />
        </div>
        <div className="registerInput__container-x2">
          <TextInput
            width="100%"
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
          <div className="fullwidth" onKeyDown={(e) => { if(e.key === "Enter") e.preventDefault(); }}>
            <Autocomplete className="input__wrapper" onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged} onKeyDown={e => { if(e.key === "Enter") e.preventDefault() }}>
              <TextInput
                width="100%"
                control={control}
                showLabel={false}
                isRequired={true}
                autocomplete="off"
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
                }} />
            </Autocomplete>
          </div>
        </div>
        <div className="registerInput__container-x2">
          <TextInput
            width="100%"
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
          <NumberInput
            width="100%"
            showLabel={false}
            control={control}
            isRequired={true}
            nameInput="phone"
            label="Phone Number"
            placeHolderText="Phone Number*"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 12,
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
          <div className="fullwidth">
            <RadioInput
              data={radioData}
              showLabel={true}
              control={control}
              isRequired={true}
              labelName="Delivery Available"
              nameInput="delivery_available"
              rules={{
                required: true,
              }} />
            {watch('delivery_available') && <NumberInput
              width="100%"
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
              }} /> || null}
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
            showLabel={true}
            control={control}
            isRequired={false}
            label="Shop Detail*"
            nameInput="description"
            placeHolderText="Tell us about the shop"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 230,
                message: "El campo supera los 230 caracteres",
              },
              required: "*El campo es requerido.",
              pattern: {
                value: /^\S/,
                message: "No debe tener espacios al inicio",
              },
            }} />
        </div>
        <UploadPhotoInput
          type="imageUpload"
          title="Add Images"
          uploadedImages={watch('images')}
          setUploadedImages={setUploadedImages} />
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
          <Button className="dark-blue fullwidth" label={user.id ? "Save" : "Sign up"} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default RegisterVendor