import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next'
import { Autocomplete } from "@react-google-maps/api"
import { useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faHouse, faPersonShelter, faBuildingNgo } from '@fortawesome/free-solid-svg-icons'

import "./style.sass"
import { setHeader } from "@store/slices/globalSlice"
import { getUserData } from "@store/slices/usersSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import PasswordRequirements from "@ui/templates/PasswordRequirements"
import { addImages, createUser, getUser, updateUser } from "@services/userServices"
import { TextInput, MaskInput, PasswordInput, CheckBoxInput, RadioInput, UploadPhotoInput, TextAreaInput } from "@ui/forms"

const RegisterNgo = ({create = false}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const { username } = useParams()
  const [sending, setSending] = useState(false)
  const user = useSelector((state) => state.users.userData)
  const [tGlobal2] = useTranslation('translation', {keyPrefix: 'global'})
  const [t] = useTranslation('translation', { keyPrefix: 'register.registerNgo'})
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const [tToolTip] = useTranslation('translation', { keyPrefix: 'tooltips' })
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
      images: [],
      website: "",
      picture: "",
      address: "",
      password: "",
      username: "",
      role: "shelter",
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
  const radioData = [
    { name: t('shelterRadioOption'), value: 'shelter' },
    { name: t('socialOrgRadioOption'), value: 'social' },
    { name: t('bothRadioOption'), value: 'ngo' },
  ]
  
  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const setUploadedImages = (images) => {
    setValue('images', images)
  }
  const onSubmit = async (data) => {
    let response
	  const _images = data?.images
    delete data.images
    setSending(true)
    if(data?.id)
      response = await updateUser({ ...data }, {id: data?.id}, data?.id)
    else{
      delete data.password_confirmation
      response = await createUser({ ...data })
    }
    if(response?.id){
      const _sendImages = _images.map(image => {
        let _image = {...image}
        _image.entity = response?.id
        return _image
      })
      await addImages(_sendImages)
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
          id: data?.id || "",
          lat: data?.lat || "",
          lng: data?.lng || "",
          name: data?.name || "",
          phone: data?.phone || "",
          email: data?.email || "",
          password_confirmation: "",
          images: data?.images || [],
          website: data?.website || "",
          picture: data?.picture || "",
          address: data?.address || "",
          role: data?.role || "shelter",
          username: data?.username || "",
          description: data?.description || "",
        })
      })
    }
  }, []);

  return <div className="layout">
           <Dialog
            visible={visible}
            style={{ width: '50vw' }}
            header={tToolTip('rolesGuide')}
            onHide={() => {
                if (!visible) return
                setVisible(false)
            }} >
            <div className="dialog-container">
              <div>
                <h4>{tToolTip('socialOrgTitle')}  <FontAwesomeIcon color='var(--dark-blue)' icon={faPersonShelter} fontSize="1.1rem" /></h4>
                <p className="mt-2">{tToolTip('socialOrgBodyText')}</p>
              </div>
              <div>
                <h4>{tToolTip('shelterTitle')}  <FontAwesomeIcon color='var(--dark-blue)' icon={faHouse} fontSize="1.1rem" /></h4>
                <p className="mt-2">{tToolTip('shelterBodyText')}</p>
              </div>
              <div>
                <h4>{tToolTip('bothTitle')}  <FontAwesomeIcon color='var(--dark-blue)' icon={faBuildingNgo} fontSize="1.1rem" /></h4>
                <p className="mt-2">{tToolTip('bothBodyText')}</p>
              </div>
            </div>
        </Dialog>
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
                value: /^[a-z0-9_]+$/,
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
            labelName={t('organizationNameInputTitle')}
            placeHolderText={t('organizationNamePlaceHolderText')}
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
          <Autocomplete className="input__wrapper" onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
            <TextInput
              control={control}
              isRequired={true}
              autocomplete="off"
              nameInput="address"
              getFormErrorMessage={getFormErrorMessage}
              labelName={tGlobal2('userAddressInputLabel')}
              placeHolderText={tGlobal2('userAddressPlaceHolderText')}
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
            control={control}
            isRequired={true}
            nameInput="website"
            getFormErrorMessage={getFormErrorMessage}
            labelName={tGlobal2('userWebsiteInputLabel')}
            placeHolderText={tGlobal2('userWebsitePlaceHolderText')}
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
          <RadioInput
            data={radioData}
            nameInput="role"
            control={control}
            isRequired={true}
            labelName={t('organizationTypeLabel')}
            rules={{
              required: true,
            }}>
              { <button type="button" className='info__btn' onClick={() => setVisible(true)}><FontAwesomeIcon color='var(--dark-blue)' icon={faCircleInfo} fontSize="1.1rem" /></button>}
            </RadioInput>
         
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
                message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 1000}),
              },
              pattern: {
                value: /^\S/,
                message: tGlobal('patternErrorMessage'),
              },
            }} />
        </div>
        <UploadPhotoInput
          type="imageUpload"
          uploadedImages={watch('images')}
          title={t('organizationImgsTitle')}
          setUploadedImages={setUploadedImages} />
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
        </>}
        <div className="p-field">
          <Button className="dark-blue fullwidth" label={user?.id ? tGlobal2('saveBtnText') : tGlobal2('signUpBtnText')} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default RegisterNgo