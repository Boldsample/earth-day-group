import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { Autocomplete } from "@react-google-maps/api"
import { useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from 'react-i18next'
import PasswordRequirements from "@ui/templates/PasswordRequirements"
import { setHeader } from "@store/slices/globalSlice"
import { getUserData } from "@store/slices/usersSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import { createUser, getUser, updateUser } from "@services/userServices"
import { TextInput, NumberInput, PasswordInput, CheckBoxInput, RadioInput, UploadPhotoInput, TextAreaInput, DropDownInput } from "@ui/forms"

import "./style.sass"

const RegisterVendor = ({create = false}) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { username } = useParams()
	const [sending, setSending] = useState(false)
	const user = useSelector((state) => state.users.userData)
	const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})
	const [tGlobalErrors] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const [t, i18n] = useTranslation('translation', { keyPrefix: 'register.registerVendor'})
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
      currency: i18n.language == 'es' ? 'cop' : 'usd'
    },
  })

  const setAutocomplete = autocomplete => window.autocomplete = autocomplete
  const onPlaceChanged = e => {
    setValue('address', window?.autocomplete?.getPlace()?.formatted_address)
    setValue('lat', window?.autocomplete?.getPlace()?.geometry?.location?.lat())
    setValue('lng', window?.autocomplete?.getPlace()?.geometry?.location?.lng())
  }
  const radioData = [
    { name: tGlobal('yes'), value: 1 },
    { name: tGlobal('no'), value: 0 },
  ]
  
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
        link: "/login/",
        background: "image-1.svg",
        button_label: tGlobal('createUserBtnLabelThankYouPage'),
        content: tGlobal('newUserContentText'),
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
          role: "vendor",
          id: data?.id || "",
          lat: data?.lat || "",
          lng: data?.lng || "",
          name: data?.name || "",
          phone: data?.phone || "",
          email: data?.email || "",
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
              required: tGlobalErrors(`requiredErrorMessage`),
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
              required: tGlobalErrors(`requiredErrorMessage`),
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
            labelName={t('shopNameInputTitle')}
            getFormErrorMessage={getFormErrorMessage}
            placeHolderText={t('shopNamePlaceHolderText')}
            rules={{
              maxLength: {
                value: 100,
                message: tGlobalErrors(`inputMaxLengthErrorMessage`, {maxLength: 100}),
              },
              required: tGlobalErrors(`requiredErrorMessage`),
              pattern: {
                value: /^\S/,
                message: tGlobalErrors('patternErrorMessage'),
              },
            }} />
          <Autocomplete className="input__wrapper" onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
            <TextInput
              control={control}
              isRequired={true}
              autocomplete="off"
              nameInput="address"
              getFormErrorMessage={getFormErrorMessage}
              labelName={tGlobal('userAddressInputLabel')}
              placeHolderText={tGlobal('userAddressPlaceHolderText')}
              onKeyDown={e => { if(e.key == 'Enter') e.preventDefault() }}
              rules={{
                required: tGlobalErrors(`requiredErrorMessage`),
                pattern: {
                  value: /^\S/,
                  message: tGlobalErrors('patternErrorMessage'),
                },
              }} />
          </Autocomplete>
        </div>
        <div className="registerInput__container-x2">
          <TextInput
            control={control}
            isRequired={true}
            nameInput="website"
            getFormErrorMessage={getFormErrorMessage}
            labelName={tGlobal('userWebsiteInputLabel')}
            placeHolderText={tGlobal('userWebsitePlaceHolderText')}
            rules={{
              maxLength: {
                value: 100,
                message: tGlobalErrors(`inputMaxLengthErrorMessage`, {maxLength: 100}),
              },
              pattern: {
                value: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?(\/[a-zA-Z0-9-_?=&]+)?$/,
                message: tGlobalErrors('invalidWebAddressErrorMessage'),
              },
            }} />
          <NumberInput
            control={control}
            nameInput="phone"
            isRequired={true}
            useGrouping={false}
            getFormErrorMessage={getFormErrorMessage}
            labelName={tGlobal('userPhoneNumberInputLabel')}
            placeHolderText={tGlobal('userPhoneNumberPlaceHolderText')}
            rules={{
              maxLength: {
                value: 10,
                message: tGlobalErrors(`inputMaxLengthErrorMessage`, {maxLength: 10}),
              },
              required: tGlobalErrors(`requiredErrorMessage`),
              pattern: {
                value: /^[0-9+]+$/,
                message: tGlobalErrors('validPhoneErrorMessage'),
              },
            }} />
        </div>
        <div className="registerInput__container-x2">
          <RadioInput
            data={radioData}
            control={control}
            isRequired={true}
            labelName={t('deliveryLabel')}
            nameInput="delivery_available"
            rules={{
              required: true,
            }} />
          <RadioInput
            data={radioData}
            showLabel={true}
            control={control}
            isRequired={true}
            nameInput="pick_up_from_home"
            labelName={t('selfPickUpLabel')}
            rules={{
              required: true,
            }} />
          {!!watch('delivery_available') && <>
            <NumberInput
              mode="currency"
              control={control}
              nameInput="delivery_charges"
              isRequired={watch('delivery_available')}
              getFormErrorMessage={getFormErrorMessage}
              labelName={t('deliveryChargesPlaceHolder')}
              placeHolderText={t('deliveryChargesPlaceHolder')}
              maxFractionDigits={watch('currency') == 'cop' ? 0 : 2}
              rules={{
                maxLength: {
                  value: 12,
                  message: tGlobalErrors(`inputMaxLengthErrorMessage`, {maxLength: 12}),
                },
                required: watch('delivery_available') ? "*El campo es requerido." : false,
                pattern: {
                  value: /^\S/,
                  message: tGlobalErrors('patternErrorMessage'),
                },
              }} />
            <DropDownInput
              isEdit={true}
              control={control}
              isRequired={true}
              optionLabel="label"
              optionValue="value"
              nameInput="currency"
              labelName={tGlobal('currency')}
              placeHolderText={tGlobal('currency')}
              getFormErrorMessage={getFormErrorMessage}
              rules={{
                required: tGlobalErrors('requiredErrorMessage'),
              }}
              options={[
                {label: tGlobal('cop'), value: 'cop'},
                {label: tGlobal('usd'), value: 'usd'}
              ]} />
          </>}
        </div>
        <div className="registerInput__container-x1">
          <TextAreaInput
            control={control}
            isRequired={false}
            nameInput="description"
            getFormErrorMessage={getFormErrorMessage}
            labelName={t('textAreaIniciativeDescriptionTitle')}
            placeHolderText={t('iniciativeDescriptionPlaceholder')}
            rules={{
              maxLength: {
                value: 1000,
                message: tGlobalErrors(`inputMaxLengthErrorMessage`, {maxLength: 1000}),
              },
              pattern: {
                value: /^\S/,
                message: tGlobalErrors('patternErrorMessage'),
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
                required: tGlobalErrors(`requiredErrorMessage`),
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
                  message:
                    tGlobalErrors('passwordPatternErrorMessage'),
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
              labelName={tGlobal('userConfirmPasswordInputLabel')}
              placeHolderText={tGlobal('userConfirmPasswordPlaceHolderText')}
              rules={{
                required: user?.id ? undefined : tGlobalErrors(`requiredErrorMessage`),
                validate: value => value === getValues().password || tGlobalErrors('passwordDoNotMatchErrorMessage'),
              }} />
          </div>
          <div className="p-field mb-2">
            <div className="mb-1">
              <CheckBoxInput
                control={control}
                nameInput="accept_terms"
                rules={{ required: tGlobalErrors('acceptCheckboxErrorMessage') }}
                getFormErrorMessage={getFormErrorMessage}
                checkBoxText={<span>{tGlobal('acceptTermsText1')} <Link to="/terms-of-service/" target="_blank">{tGlobal('acceptTermsText2')}</Link>.</span>} />
            </div>
            <div>
              <CheckBoxInput
                control={control}
                nameInput="accept_policy"
                rules={{ required: tGlobalErrors('acceptCheckboxErrorMessage2') }}
                getFormErrorMessage={getFormErrorMessage}
                checkBoxText={<span>{tGlobal('acceptTermsText1')} <Link to="/privacy-policy/" target="_blank">{tGlobal('acceptTermsText3')}</Link>.</span>} />
            </div>
          </div>
        </>}
        <div className="p-field">
          <Button className="dark-blue fullwidth" label={user?.id ? tGlobal('saveBtnText') : tGlobal('signUpBtnText')} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default RegisterVendor