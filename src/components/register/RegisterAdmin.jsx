import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"

import "./style.sass"
import { setHeader } from "@store/slices/globalSlice"
import { getUserData } from "@store/slices/usersSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import PasswordRequirements from "@ui/templates/PasswordRequirements"
import { createUser, getUser, updateUser } from "@services/userServices"
import { TextInput, MaskInput, PasswordInput, UploadPhotoInput } from "@ui/forms"


const RegisterAdmin = ({create = false}) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { username } = useParams()
	const [sending, setSending] = useState(false)
	const user = useSelector((state) => state.users.userData)
	const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})
	const [t] = useTranslation('translation', { keyPrefix: 'register.registerAdmin'})
	const [tGlobalErrors] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
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
        title: tGlobal('updateUserTitleThankYouPage'),
        link: username ? '/dashboard/' : '/settings/profile/',
        background: "image-1.svg",
        button_label: username ? tGlobal('updateUserBtnLabelThankYouPage') : tGlobal('updateUserBtnLabelThankYouPage2'),
        content: tGlobal('updateUsercontentText'),
      }))
      navigate('/thankyou/')
    }else if(response?.id){
      dispatch(updateThankyou({
        title: tGlobal('createUserTitleThankYouPage'),
        link: "/admins/",
        background: "image-1.svg",
        button_label: tGlobal('updateUserBtnLabelThankYouPage'),
        content: tGlobal('newAdminContextText'),
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
            labelName={tGlobal('userNameInputLabel')}
            placeHolderText={tGlobal('userNamePlaceHolderText')}
            rules={{
              maxLength: {
                value: 80,
                message: tGlobalErrors(`inputMaxLengthErrorMessage`, {maxLength: 80}),
              },
              required: tGlobalErrors('requiredErrorMessage'),
              pattern: {
                value: /^[a-zA-Z_]+$/,
                message: tGlobalErrors('lettersandUnderscoreOnlyErrorMessage'),
              },
            }} />
          <TextInput
            control={control}
            nameInput="email"
            isRequired={true}
            getFormErrorMessage={getFormErrorMessage}
            labelName={tGlobal('userEmailInputLabel')}
            placeHolderText={tGlobal('userEmailPlaceHolderText')}
            rules={{
              maxLength: {
                value: 100,
                message: tGlobalErrors(`inputMaxLengthErrorMessage`, {maxLength: 100}),
              },
              required: tGlobalErrors('requiredErrorMessage'),
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: tGlobalErrors('validEmailAddressErrorMessage'), 
              },
            }} />
        </div>
        <div className="registerInput__container-x2">
          <TextInput
            nameInput="name"
            control={control}
            isRequired={true}
            getFormErrorMessage={getFormErrorMessage}
            labelName={tGlobal('userFullNameInputLabel')}
            placeHolderText={tGlobal('userFullNamePlaceholderText')}
            rules={{
              maxLength: {
                value: 100,
                message: tGlobalErrors(`inputMaxLengthErrorMessage`, {maxLength: 100}),
              },
              required: tGlobalErrors('requiredErrorMessage'),
              pattern: {
                value: /^\S/,
                message: tGlobalErrors('patternErrorMessage'),
              },
            }} />
          <MaskInput
            control={control}
            nameInput="phone"
            isRequired={true}
            getFormErrorMessage={getFormErrorMessage}
            labelName={tGlobal('userPhoneNumberInputLabel')}
            placeHolderText={tGlobal('userPhoneNumberPlaceHolderText')}
            rules={{
              maxLength: {
                value: 10,
                message: tGlobalErrors(`inputMaxLengthErrorMessage`, {maxLength: 10}),
              },
              required: tGlobalErrors('requiredErrorMessage'),
              pattern: {
                value: /^[0-9+]+$/,
                message: tGlobalErrors('validPhoneErrorMessage'),
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
              labelName={tGlobal('userPasswordInputLabel')}
              passwordRequirementsPopUp={PasswordRequirements}
              placeHolderText={tGlobal('userPasswordPlaceHolderText')}
              rules={{
                maxLength: {
                  value: 20,
                  message: tGlobalErrors(`inputMaxLengthErrorMessage`, {maxLength: 20})
                },
                required: tGlobalErrors('requiredErrorMessage'),
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
                  message:
                    tGlobalErrors('passwordPatternErrorMessage'),
                },
              }} />
            <PasswordInput
              maxLength={20}
              feedback={false}
              control={control}
              showLabel={false}
              isRequired={true}
              nameInput="password_confirmation"
              getFormErrorMessage={getFormErrorMessage}
              labelName={tGlobal('userConfirmPasswordInputLabel')}
              placeHolderText={tGlobal('userConfirmPasswordPlaceHolderText')}
              rules={{
                required: tGlobalErrors('requiredErrorMessage'),
                validate: value => value === getValues().password || tGlobalErrors('passwordDoNotMatchErrorMessage'),
              }} />
          </div>
        </>}
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
          <Button className="dark-blue fullwidth" label={user?.id ? tGlobal('saveBtnText') : tGlobal('signUpBtnText')} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default RegisterAdmin