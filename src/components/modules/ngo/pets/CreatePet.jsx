import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useNavigate } from "react-router"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from 'react-i18next'

import { setHeader } from "@store/slices/globalSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import { addImages, addPet, updatePet } from "@services/petServices"
import { TextInput, NumberInput, UploadPhotoInput, TextAreaInput, DropDownInput, RadioInput } from "@ui/forms"

const CreatePet = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const numberInput = useRef(null)
  const [pet, setPet] = useState({})
  const [sending, setSending] = useState(false)
  const user = useSelector((state) => state.users.userData)
  const [t] = useTranslation('translation', { keyPrefix: 'ngo.pets.createPet' })
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const species = [
    { name: t('petTypeCatText'), code: "Cat" },
    { name: t('petTypeDogText'), code: "Dog" }
  ]
  const genders = [
    { name: t("petGenderMaleText"), value: 'Male' },
    { name: t("petGenderFemaleText"), value: 'Female' },
  ]
  const {
    watch,
    control,
    setValue,
    setFocus,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      weight: "",
      user: user?.id,
      age: pet?.age || "",
      name: pet?.name || "",
      breed: pet?.breed || "",
      specie: pet?.specie || "",
      gender: pet?.gender || "",
      images: pet?.images || [],
      description: pet?.description || "",
    },
  })

  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const setUploadedImages = (images) => {
    setValue('images', images)
  }
  const onSubmit = async (data) => {
    let response
    let _pet = { ...pet, ...data }
    delete _pet.images
    setSending(true)
    if(pet?.id)
      response = await updatePet({ ..._pet }, {id: pet.id})
    else
      response = await addPet({ ..._pet })
    if(response.field){
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
      setSending(false)
      return
    }
    const _sendImages = data.images.map(image => {
      let _image = {...image}
      _image.type = 'pet'
      _image.entity = response.id
      return _image
    })
    await addImages(_sendImages)
    setSending(false)
    if(pet?.id && response?.id){
      dispatch(updateThankyou({
        title: t('editPetthankyouPagetitle'),
        link: `/pet/${response?.id}/`,
        background: "image-1.svg",
        button_label: t('editPetthankyouPagebuttonLabel'),
        content: t('editPetthankyouPagebodyText'),
      }))
      navigate('/thankyou/')
    }else if(response.id){
      dispatch(updateThankyou({
        title: t('createPetthankyouPagetitle'),
        link: `/pet/${response?.id}/`,
        background: "image-1.svg",
        button_label: t('createPetthankyouPagebuttonLabel'),
        content: t('createPetthankyouPagebodyText'),
      }))
      navigate('/thankyou/')
    }
  }

  useEffect(() => {
      dispatch(setHeader("user"));
  }, []);

  return <div className="layout">
    <img className="layout__background" src="/assets/register/image-2.svg" />
    <div className="main__content xpadding-1">
      <form onSubmit={handleSubmit(onSubmit)} className="fullwidth">
        <div className="registerInput__container-x2">
          <TextInput
            width="100%"
            nameInput="name"
            control={control}
            isRequired={true}
            labelName={t('inputNameTitleText')}
            placeHolderText={t('namePlaceHolderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 60,
                message:  tGlobal('inputMaxLengthErrorMessage', {maxLength: 60}),
              },
              required: tGlobal('requiredErrorMessage'),
              pattern: {
                value: /^\S/,
                message: tGlobal('patternErrorMessage'),
              },
            }} />
            <RadioInput
              data={genders}
              showLabel={true}
              control={control}
              isRequired={true}
              labelName={t('inputRadioTitleText')}
              nameInput="gender"
              rules={{
                required: true,
              }} />
        </div>
        <div className="registerInput__container-x2">
          <DropDownInput
            className=""
            isEdit={true}
            control={control}
            isRequired={true}
            optionLabel="name"
            optionValue="code"
            options={species}
            labelName={t('dropdownSpeciesTitleText')}
            nameInput="specie"
            placeHolderText={t('dropdownSpeciesPlaceholderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              required: tGlobal('requiredErrorMessage'),
            }} />
          <TextInput
            width="100%"
            showLabel={true}
            control={control}
            isRequired={true}
            labelName={t('inputBreedTitleText')}
            nameInput="breed"
            placeHolderText={t('breedPlaceHolderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 80,
                message: tGlobal('inputMaxLengthErrorMessage', {maxLength: 80}),
              },
              required: tGlobal('requiredErrorMessage'),
              pattern: {
                value: /^\S/,
                message: tGlobal('patternErrorMessage'),
              },
            }} />
        </div>
        <div className="registerInput__container-x2">
          <NumberInput
            label={t('inputAgeTitleText')}
            width="100%"
            nameInput="age"
            control={control}
            showLabel={false}
            isRequired={true}
            placeHolderText={t('agePlaceholderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 2,
                message: tGlobal('inputMaxLengthErrorMessage', {maxLength: 2})
              },
              required: tGlobal('requiredErrorMessage'),
              pattern: {
                value: /^\S/,
                message: tGlobal('patternErrorMessage'),
              },
            }} />
          <NumberInput
            width="100%"
            showLabel={false}
            control={control}
            isRequired={true}
            nameInput="weight"
            label={t('inputWeightTitleText')}
            placeHolderText={t('weightPlaceholderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 2,
                message: tGlobal('inputMaxLengthErrorMessage', {maxLength: 2}),
              },
              required: tGlobal('requiredErrorMessage'),
              pattern: {
                value: /^\S/,
                message: tGlobal('patternErrorMessage'),
              },
            }} />
        </div>
        <div className="registerInput__container-x1">
          <TextAreaInput
            showLabel={true}
            control={control}
            isRequired={false}
            label={t('textAreaPetDescriptionTitle')}
            nameInput="description"
            placeHolderText={t('petDescriptionPlaceholder')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 1000,
                message: "El campo supera los 1000 caracteres",
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
          title={t('petImageUploaderTitle')}
          uploadedImages={watch('images')}
          setUploadedImages={setUploadedImages} />
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
          <Button className="dark-blue fullwidth" label={pet?.id ? t('updatePetbtnText') : t('submitPetbtnText')} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default CreatePet