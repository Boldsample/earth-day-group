import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"

import { setHeader } from "@store/slices/globalSlice"
import { getUserData } from "@store/slices/usersSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import { createUser, getUser, updateUser } from "@services/userServices"
import { TextInput, NumberInput, PasswordInput, UploadPhotoInput } from "@ui/forms"

import "./style.sass"

const RegisterAdmin = ({create = false}) => {
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
      name: "",
      phone: "",
      email: "",
      picture: "",
      username: "",
      password: "",
      role: "admin",
      password_confirmation: "",
    },
  })
  
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
        link: username ? "/admins/" : "/dashboard/",
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
        button_label: "Go back to admins",
        content: "You register a new admin user! We send an email verification link.",
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
          name: data?.name || "",
          phone: data?.phone || "",
          email: data?.email || "",
          password_confirmation: "",
          picture: data?.picture || "",
          username: data?.username || ""
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
            width="100%"
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
            width="100%"
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
            width="100%"
            labelName="Name"
            nameInput="name"
            control={control}
            isRequired={true}
            placeHolderText="Complete Name*"
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
          <NumberInput
            width="100%"
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
        {!username && 
          <div className="registerInput__container-x2">
            <PasswordInput
              width="100%"
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
                required: ID ? undefined : "*The field is required.",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  message:
                    "Must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
                },
              }} />
            <PasswordInput
              width="100%"
              maxLength={20}
              feedback={false}
              isRequired={!ID}
              control={control}
              className="noLabel"
              labelName="Confirm pasword"
              nameInput="password_confirmation"
              placeHolderText="Confirm Password"
              getFormErrorMessage={getFormErrorMessage}
              rules={{
                required: ID ? undefined : "*The field is required.",
                validate: value => value === getValues().password || "The password doesn't match",
              }} />
          </div>
        }
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
          <Button className="dark-blue fullwidth" label={user?.id ? "Save" : "Sign up"} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default RegisterAdmin