import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { Autocomplete } from "@react-google-maps/api"
import { useTranslation } from 'react-i18next'
import { checkUser } from "@services/userServices"
import { TextInput, NumberInput, PasswordInput, TextAreaInput, CheckBoxInput, UploadPhotoInput } from "@ui/forms"
import PasswordRequirements from "@ui/templates/PasswordRequirements"

const CompanyStandardForm = ({ user, setUser, ID, setActiveIndex }) => {
  const [t] = useTranslation('translation', { keyPrefix: 'register.registerCompany.companyStandardForm'})
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const [tGlobal2] = useTranslation('translation', {keyPrefix: 'global'})
  const { username } = useParams()
  const [sending, setSending] = useState(false)
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
      nit: "",
      name: "",
      phone: "",
      email: "",
      picture: "",
      address: "",
      website: "",
      username: "",
      password: "",
      role: "company",
      description: "",
      accept_terms: false,
      accept_policy: false,
      password_confirmation: "",
    }
  })
  

  const setAutocomplete = autocomplete => window.autocomplete = autocomplete
  const onPlaceChanged = e => {
    setValue('address', window?.autocomplete?.getPlace()?.formatted_address)
    setValue('lat', window?.autocomplete?.getPlace()?.geometry?.location?.lat())
    setValue('lng', window?.autocomplete?.getPlace()?.geometry?.location?.lng())
  }
  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const onSubmit = async (data) => {
    setSending(true)
    const { email, username } = getValues()
    const response = await checkUser({ email, username }, ID)
    setSending(false)
    if(response?.field){
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
      return
    }
    setUser({ ...user, ...data })
    setActiveIndex(1)
  }


  useEffect(() => {
    if(user?.username)
      reset({
        password: "",
        role: "company",
        lat: user?.lat || "",
        lng: user?.lng || "",
        nit: user?.nit || "",
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        password_confirmation: "",
        picture: user?.picture || "",
        address: user?.address || "",
        website: user?.website || "",
        username: user?.username || "",
        description: user?.description || "",
      })
  }, [user]);

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
        // disabled={ID}
        control={control}
        isRequired={true}
        labelName={tGlobal2('userNameInputLabel')}
        nameInput="username"
        placeHolderText={tGlobal2('userNamePlaceHolderText')}
        getFormErrorMessage={getFormErrorMessage}
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
        labelName="E-mail"
        placeHolderText={tGlobal2('userEmailPlaceHolderText')}
        getFormErrorMessage={getFormErrorMessage}
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
        labelName={t('companyNameTitle')}
        placeHolderText={t('companyNamePlaceHolderText')}
        getFormErrorMessage={getFormErrorMessage}
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
      <NumberInput
        isRequired={true}
        control={control}
        nameInput="phone"
        labelName={tGlobal2('userPhoneNumberInputLabel')}
        placeHolderText={tGlobal2('userPhoneNumberPlaceHolderText')}
        getFormErrorMessage={getFormErrorMessage}
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
          autocomplete="off"
          labelName={tGlobal2('userAddressInputLabel')}
          nameInput="address"
          placeHolderText={tGlobal2('userAddressPlaceHolderText')}
          getFormErrorMessage={getFormErrorMessage}
          onKeyDown={e => { if(e.key == 'Enter') e.preventDefault() }}
          rules={{
            required: tGlobal(`requiredErrorMessage`),
            pattern: {
              value: /^\S/,
              message: tGlobal('patternErrorMessage'),
            },
          }} />
      </Autocomplete>
    </div>
    <div className="registerInput__container-x2">
      <TextInput
        labelName={t('companyNitTitle')}
        nameInput="nit"
        control={control}
        isRequired={true}
        placeHolderText={t('companyNitPlaceHolderText')}
        getFormErrorMessage={getFormErrorMessage}
        rules={{
          maxLength: {
            value: 20,
            message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 20}),
          },
          required: tGlobal(`requiredErrorMessage`),
          pattern: {
            value: /^[0-9]+/,
            message: tGlobal('invalidNitErrorMessage'),
          },
        }} />
      <TextInput
        control={control}
        isRequired={true}
        labelName={tGlobal2('userWebsiteInputLabel')}
        nameInput="website"
        placeHolderText={tGlobal2('userWebsitePlaceHolderText')}
        getFormErrorMessage={getFormErrorMessage}
        rules={{
          maxLength: {
            value: 100,
            message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 100}),
          },
          pattern: {
            value: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?(\/[a-zA-Z0-9-_?=&]+)?$/,
            message: tGlobal('invalidWebAddressErrorMessage'),
          },
        }} />
    </div>
    <div className="registerInput__container-x1">
      <TextAreaInput
        control={control}
        labelName={t('textAreaCompanyDescriptionLabel')}
        nameInput="description"
        getFormErrorMessage={getFormErrorMessage}
        placeHolderText={t('textAreaCompanyDescriptionPlaceholder')}
        rules={{
          maxLength: {
            value: 1000,
            message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 100}),
          },
          pattern: {
            value: /^\S/,
            message: tGlobal('patternErrorMessage'),
          },
        }} />
    </div>
    {!username && <>
      <div className="registerInput__container-x2">
        <PasswordInput
          passwordRequirementsPopUp={PasswordRequirements}
          maxLength={20}
          isRequired={!ID}
          control={control}
          labelName={tGlobal2('userPasswordInputLabel')}
          nameInput="password"
          placeHolderText={tGlobal2('userPasswordPlaceHolderText')}
          getFormErrorMessage={getFormErrorMessage}
          rules={{
            maxLength: {
              value: 20,
              message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 20}),
            },
            required: username ? undefined : tGlobal(`requiredErrorMessage`),
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
          isRequired={!ID}
          control={control}
          className="noLabel"
          labelName={tGlobal2('userConfirmPasswordInputLabel')}
          nameInput="password_confirmation"
          placeHolderText={tGlobal2('userConfirmPasswordPlaceHolderText')}
          getFormErrorMessage={getFormErrorMessage}
          rules={{
            required: user?.id ? undefined : tGlobal(`requiredErrorMessage`),
            validate: value => value === getValues().password || tGlobal('passwordDoNotMatchErrorMessage'),
          }} />
      </div>
    </>}
    {!ID && 
      <div className="p-field mb-2">
        <div className="mb-1">
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
    }
    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
      <Button className="dark-blue fullwidth" label={t('continueBtnText')} type="submit" name="submit" loading={sending} />
    </div>
  </form>
}

export default CompanyStandardForm