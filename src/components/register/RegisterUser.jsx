import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next'
import { Autocomplete } from "@react-google-maps/api"
import { useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"

import "./style.sass"
import { setHeader } from "@store/slices/globalSlice"
import { getUserData } from "@store/slices/usersSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import PasswordRequirements from "@ui/templates/PasswordRequirements"
import { createUser, getUser, updateUser } from "@services/userServices"
import { TextInput, MaskInput, PasswordInput, TextAreaInput, CheckBoxInput, UploadPhotoInput } from "@ui/forms"


const RegisterUser = ({create = false}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { username } = useParams()
  const [sending, setSending] = useState(false)
  const user = useSelector((state) => state.users.userData)
  const [tGlobal2] = useTranslation('translation', {keyPrefix: 'global'})
  const [t] = useTranslation('translation', { keyPrefix: 'register.registerUser'})
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
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
      picture: "",
      address: "",
      role: "user",
      username: "",
      password: "",
      description: "",
      accept_terms: false,
      accept_policy: false,
      password_confirmation: "",
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
        link: "/login/",
        background: "image-1.svg",
        button_label: tGlobal2('createUserBtnLabelThankYouPage'),
        content: tGlobal2('newUserContentText'),
      }))
      navigate('/thankyou/')
    }else{
      setFocus(response.field)
      setError(response.field, { type: "manual", message: tGlobal(response.message) })
      return
    }
  }

  useEffect(() => {
    dispatch(setHeader("register"))
    if(!create){
      const _username = username || user?.username
      getUser(_username, user?.id).then(data => {
        reset({
          role: "user",
          id: data?.id || "",
          lat: data?.lat || "",
          lng: data?.lng || "",
          name: data?.name || "",
          phone: data?.phone || "",
          email: data?.email || "",
          picture: data?.picture || "",
          address: data?.address || "",
          username: data?.username || "",
          description: data?.description || ""
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
            onInput={e => {
              const regex = /^[a-z0-9_]*$/
              if(!regex.test(e.target.value))
                e.target.value = e.target.value.replace(/[^a-z0-9_]/g, "")
            }}
            rules={{
              maxLength: {
                value: 80,
                message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 80}),
              },
              required: tGlobal(`requiredErrorMessage`),
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
              required: tGlobal(`requiredErrorMessage`),
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
              required: tGlobal(`requiredErrorMessage`),
              pattern: {
                value: /^\S/,
                message: tGlobal('patternErrorMessage'),
              },
            }} />
          <MaskInput
            isRequired={true}
            control={control}
            nameInput="phone"
            getFormErrorMessage={getFormErrorMessage}
            labelName={tGlobal2('userPhoneNumberInputLabel')}
            placeHolderText={tGlobal2('userPhoneNumberPlaceHolderText')}
            rules={{
              maxLength: {
                value: 10,
                message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 10}),
              },
              required: tGlobal(`requiredErrorMessage`),
              pattern: {
                value: /^[0-9+]+$/,
                message: tGlobal('validPhoneErrorMessage'),
              },
            }} />
        </div>
        <div className="registerInput__container-x1">
          <Autocomplete className="input__wrapper" onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
            <TextInput
              control={control}
              isRequired={true}
              nameInput="address"
              autocomplete="new-address"
              getFormErrorMessage={getFormErrorMessage}
              labelName={tGlobal2('userAddressInputLabel')}
              placeHolderText={tGlobal2('userAddressPlaceHolderText')}
              onKeyDown={e => { if(e.key == 'Enter') e.preventDefault() }}
              rules={{
                validate: (value) => (watch("lat") && watch("lng")) || tGlobal(`latlngErrorMessage`),
                required: tGlobal(`requiredErrorMessage`),
                pattern: {
                  value: /^\S/,
                  message: tGlobal('patternErrorMessage'),
                },
              }} />
          </Autocomplete>
        </div>
        <div className="registerInput__container-x1">
          <TextAreaInput
            control={control}
            isRequired={false}
            nameInput="description"
            getFormErrorMessage={getFormErrorMessage}
            labelName={t('textAreaBioDescriptionTitle')}
            placeHolderText={t('bioDescriptionPlaceholder')}
            rules={{
              maxLength: {
                value: 1000,
                message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 1000}),
              },
              pattern: {
                value: /^\S/,
                message: tGlobal('patternErrorMessage'),
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
                required: tGlobal(`requiredErrorMessage`),
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
                  message:
                    tGlobal('passwordPatternErrorMessage'),
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
              labelName={tGlobal2('userConfirmPasswordInputLabel')}
              placeHolderText={tGlobal2('userConfirmPasswordPlaceHolderText')}
              rules={{
                required: tGlobal(`requiredErrorMessage`),
                validate: value => value === getValues().password || tGlobal('passwordDoNotMatchErrorMessage'),
              }} />
          </div>
          <div className="p-field mb-2">
            <div className="mb-2">
              <CheckBoxInput
                control={control}
                nameInput="accept_terms"
                rules={{ required: tGlobal('acceptCheckboxErrorMessage') }}
                getFormErrorMessage={getFormErrorMessage}
                checkBoxText={<span>{tGlobal2('acceptTermsText1')} <Link to="/terms-of-service/" target="_blank">{tGlobal2('acceptTermsText2')}</Link>.</span>} />
            </div>
            <div>
              <CheckBoxInput
                control={control}
                nameInput="accept_policy"
                rules={{ required: tGlobal('acceptCheckboxErrorMessage2') }}
                getFormErrorMessage={getFormErrorMessage}
                checkBoxText={<span>{tGlobal2('acceptTermsText1')} <Link to="/privacy-policy/" target="_blank">{tGlobal2('acceptTermsText3')}</Link>.</span>} />
            </div>
          </div>
        </>}
        <div className="p-field">
          <Button className="dark-blue fullwidth" label={user?.id ? tGlobal2('saveBtnText') : tGlobal2('signUpBtnText')} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default RegisterUser