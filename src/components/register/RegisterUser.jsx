import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { Autocomplete } from "@react-google-maps/api"
import { useDispatch, useSelector } from "react-redux"

import { getUserData } from "@store/slices/usersSlice"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import { updateThankyou } from "@store/slices/globalSlice"
import { createUser, updateUser } from "@services/userServices"
import { setHeader, setHeaderTitle } from "@store/slices/globalSlice"
import { TextInput, NumberInput, PasswordInput, TextAreaInput, DropDownInput, CheckBoxInput, FileUploadInput } from "@ui/forms"

import "./style.sass"

const RegisterUser = () => {
  const dispatch = useDispatch();
  const [sending, setSending] = useState(false)
  const user = useSelector((state) => state.users.userData);
  const {
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "user",
      password: "",
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      password_confirmation: "",
      picture: user?.picture || "",
      address: user?.address || "",
      username: user?.username || "",
      description: user?.description || "",
      accept_terms: user?.accept_terms && true || false,
    },
  });

  const getFormErrorMessage = (fieldName) =>
    errors[fieldName] && (
      <small className="p-error">{errors[fieldName]?.message}</small>
    );
  const onSubmit = async (data) => {
    let id
    setSending(true)
    if(user.id){
      if(data.password == ''){
        delete data.password
        delete data.password_confirmation
      }
      id = await updateUser({ ...data }, {id: user.id})
    }else
      id = await createUser({ ...user, ...data })
	  setSending(false)
    if(user.id)
      toast.success("Your profile has been updated successfully.")
    else
      dispatch(
        updateThankyou({
          title: "Congrats!",
          link: "/dashboard/",
          background: "image-1.svg",
          button_label: "Go to dashboard",
          content:
            "You’re all signed up! We send you a verification link send your provide email. Please verify your identity.",
        })
      )
    dispatch(getUserData(id))
  }
  const setAutocomplete = autocomplete => window.autocomplete = autocomplete
  const onPlaceChanged = () => {
    setValue('address', window.autocomplete.getPlace()?.formatted_address)
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
    <div className="main__content halfwidth">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="profile__container">
          <div className="profilePicture__container">
            <ProfilePhoto userPhoto={getValues("picture")} />
          </div>
          <div className="profileUpload__container">
            <h5 className="profileUpload__title text-defaultCase">
              Profile Picture
            </h5>
            <FileUploadInput
              watch={watch}
              control={control}
              nameInput="picture"
              setValue={setValue}
            />
          </div>
        </div>
        <div className="registerInput__container-x2">
          <TextInput
            isRequired={true}
            labelName="Name"
            isEdit={true}
            getFormErrorMessage={getFormErrorMessage}
            control={control}
            nameInput="name"
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
            labelName="Username"
            isEdit={true}
            getFormErrorMessage={getFormErrorMessage}
            control={control}
            nameInput="username"
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
          <Autocomplete className="input__wrapper" onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
            <TextInput
              width="100%"
              isEdit={true}
              control={control}
              showLabel={false}
              isRequired={true}
              autocomplete="off"
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
        <TextAreaInput
          label="Bio"
          showLabel={true}
          control={control}
          isRequired={false}
          nameInput="description"
          placeHolderText="Tell us about yourself"
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
          }}
        />
        <NumberInput
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
              value: 12,
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
          <Button className="dark-blue fullwidth" label={user.id ? "Save" : "Sign up"} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default RegisterUser