import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { Autocomplete } from "@react-google-maps/api"
import { useDispatch, useSelector } from "react-redux"

import { getUserData } from "@store/slices/usersSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import { setHeader, setHeaderTitle } from "@store/slices/globalSlice"
import { addImages, createUser, updateUser } from "@services/userServices"
import { TextInput, NumberInput, PasswordInput, CheckBoxInput, RadioInput, UploadPhotoInput, TextAreaInput } from "@ui/forms"

// import "./style.sass"

const CreatePet = () => {
  const dispatch = useDispatch()
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
      name: user?.name || "",
      gender: user?.phone || "",
      age: user?.email || "",
      weight: "",
      images: user?.images || [],
      breed: user?.picture || "",
      adoption_price: user?.address || "",
      description: user?.description || "",
    },
  })

  const setAutocomplete = autocomplete => window.autocomplete = autocomplete
  const onPlaceChanged = () => setValue('address', window?.autocomplete?.getPlace()?.formatted_address)
  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>

  const radioData = [
    { name: "Male", value: 1 },
    { name: "Female", value: 2 },
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
    if(user?.id)
      toast.success("Your profile has been updated successfully.")
    else if(response.id)
      dispatch(updateThankyou({
        title: "Congrats!",
        link: "/dashboard/",
        background: "image-1.svg",
        button_label: "Go to dashboard",
        content: "You’re all signed up! We send you a verification link send your provide email. Please verify your identity.",
      }))
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
        <div className="registerInput__container-x1">
          <TextInput
            width="100%"
            nameInput="name"
            control={control}
            showLabel={true}
            isRequired={true}
            labelName="Pet Name"
            placeHolderText="Enter Pet Name*"
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
              <RadioInput
              data={radioData}
              showLabel={true}
              control={control}
              isRequired={true}
              labelName="Gender"
              nameInput="gender"
              rules={{
                required: true,
              }} />
            </div>
        <div className="registerInput__container-x2">
        <NumberInput
            width="100%"
            showLabel={false}
            control={control}
            isRequired={true}
            nameInput="age"
            label="Age"
            placeHolderText="Age*"
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
            <NumberInput
            width="100%"
            showLabel={false}
            control={control}
            isRequired={true}
            nameInput="weight"
            label="Weight (Kilog?)"
            placeHolderText="Weight (Kilos)*"
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
        <div className="registerInput__container-x1">
        <TextInput
            width="100%"
            control={control}
            showLabel={false}
            isRequired={true}
            labelName="Breed"
            nameInput="breed"
            placeHolderText="Breed"
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
        <NumberInput
            width="100%"
            showLabel={true}
            control={control}
            isRequired={true}
            nameInput="adoption_price"
            label="Adoption Price"
            placeHolderText="Enter adoption price*"
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
        <div className="registerInput__container-x1">
          <TextAreaInput
            showLabel={true}
            control={control}
            isRequired={false}
            label="Pet Details*"
            nameInput="description"
            placeHolderText="Enter a description for your pet"
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
        
        <div className="p-field" style={{ marginBottom: "24px" }}>
          <Button className="dark-blue fullwidth" label={user.id ? "Save" : "Register Pet"} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default CreatePet