import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from 'react-i18next'
import PasswordRequirements from "@ui/templates/PasswordRequirements"

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
	const [sending, setSending] = useState(false)
	const user = useSelector((state) => state.users.userData)
	const [tGlobal2] = useTranslation('translation', {keyPrefix: 'global'})
	const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
	const [t] = useTranslation('translation', { keyPrefix: 'register.registerAdmin'})
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
    if(data?.id)
      response = await updateUser({ ...data }, {id: data?.id}, data?.id)
    else{
      delete data.password_confirmation
      response = await createUser({ ...data })
    }
    setSending(false)
    if(response?.id == user?.id)
      dispatch(getUserData(response?.id))
    if(data?.id && response?.id){
      dispatch(updateThankyou({
        title: tGlobal2('updateUserTitleThankYouPage'),
        link: username ? '/dashboard/' : '/settings/profile/',
        background: "image-1.svg",
        button_label: username ? tGlobal2('updateUserBtnLabelThankYouPage') : tGlobal2('updateUserBtnLabelThankYouPage2'),
        content: tGlobal2('updateUsercontentText'),
      }))
      navigate('/thankyou/')
    }else if(response?.id){
      dispatch(updateThankyou({
        title: tGlobal2('createUserTitleThankYouPage'),
        link: "/admins/",
        background: "image-1.svg",
        button_label: tGlobal2('updateUserBtnLabelThankYouPage'),
        content: tGlobal2('newAdminContextText'),
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
        reset({
          role: "admin",
          id: data?.id || "",
          name: data?.name || "",
          phone: data?.phone || "",
          email: data?.email || "",
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
            control={control}
            isRequired={true}
            nameInput="username"
            disabled={watch('id')}
            getFormErrorMessage={getFormErrorMessage}
            labelName={tGlobal2('userNameInputLabel')}
            placeHolderText={tGlobal2('userNamePlaceHolderText')}
            rules={{
              maxLength: {
                value: 80,
                message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 80}),
              },
              required: tGlobal('requiredErrorMessage'),
              pattern: {
                value: /^[a-zA-Z_]+$/,
                message: tGlobal('lettersandUnderscoreOnlyErrorMessage'),
              },
            }} />
          <TextInput
            control={control}
            nameInput="email"
            isRequired={true}
            getFormErrorMessage={getFormErrorMessage}
            labelName={tGlobal2('userEmailInputLabel')}
            placeHolderText={tGlobal2('userEmailPlaceHolderText')}
            rules={{
              maxLength: {
                value: 100,
                message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 100}),
              },
              required: tGlobal('requiredErrorMessage'),
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: tGlobal('validEmailAddressErrorMessage'), 
              },
            }} />
        </div>
        <div className="registerInput__container-x2">
          <TextInput
            nameInput="name"
            control={control}
            isRequired={true}
            getFormErrorMessage={getFormErrorMessage}
            labelName={tGlobal2('userFullNameInputLabel')}
            placeHolderText={tGlobal2('userFullNamePlaceholderText')}
            rules={{
              maxLength: {
                value: 100,
                message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 100}),
              },
              required: tGlobal('requiredErrorMessage'),
              pattern: {
                value: /^\S/,
                message: tGlobal('patternErrorMessage'),
              },
            }} />
          <NumberInput
            control={control}
            nameInput="phone"
            isRequired={true}
            useGrouping={false}
            getFormErrorMessage={getFormErrorMessage}
            labelName={tGlobal2('userPhoneNumberInputLabel')}
            placeHolderText={tGlobal2('userPhoneNumberPlaceHolderText')}
            rules={{
              maxLength: {
                value: 10,
                message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 10}),
              },
              required: tGlobal('requiredErrorMessage'),
              pattern: {
                value: /^[0-9+]+$/,
                message: tGlobal('validPhoneErrorMessage'),
              },
            }} />
        </div>
        {create && <>
          <div className="registerInput__container-x2">
            <PasswordInput
              maxLength={20}
              control={control}
              isRequired={true}
              nameInput="password"
              getFormErrorMessage={getFormErrorMessage}
              labelName={tGlobal2('userPasswordInputLabel')}
              passwordRequirementsPopUp={PasswordRequirements}
              placeHolderText={tGlobal2('userPasswordPlaceHolderText')}
              rules={{
                maxLength: {
                  value: 20,
                  message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 20})
                },
                required: tGlobal('requiredErrorMessage'),
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
                  message:
                    tGlobal('passwordPatternErrorMessage'),
                },
              }} />
            <PasswordInput
              maxLength={20}
              feedback={false}
              showLabel={true}
              control={control}
              isRequired={true}
              className="noLabel"
              nameInput="password_confirmation"
              getFormErrorMessage={getFormErrorMessage}
              labelName={tGlobal2('userConfirmPasswordInputLabel')}
              placeHolderText={tGlobal2('userConfirmPasswordPlaceHolderText')}
              rules={{
                required: tGlobal('requiredErrorMessage'),
                validate: value => value === getValues().password || tGlobal('passwordDoNotMatchErrorMessage'),
              }} />
          </div>
        </>}
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
          <Button className="dark-blue fullwidth" label={user?.id ? tGlobal2('saveBtnText') : tGlobal2('signUpBtnText')} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default RegisterAdmin