import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"

import { setHeader } from "@store/slices/globalSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import { addImages, addPet, getPet, updatePet } from "@services/petServices"
import { TextInput, NumberInput, UploadPhotoInput, TextAreaInput, DropDownInput, RadioInput } from "@ui/forms"

const CreatePet = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const user = useSelector((state) => state.users.userData)
  const [tMaterials] = useTranslation('translation', { keyPrefix: 'materials' })
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const [t, i18n] = useTranslation('translation', { keyPrefix: 'ngo.pets.createPet' })
  const {
    watch,
    reset,
    control,
    setValue,
    setFocus,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      weight: "",
      age: "",
      name: "",
      breed: "",
      specie: "",
      gender: "",
      images: [],
      user: user?.id,
      description: "",
      age_unit: "months",
      weight_unit: i18n.language == 'es' ? "kilograms" : "pounds",
    },
  })

  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const setUploadedImages = (images) => {
    setValue('images', images)
  }
  const onSubmit = async (data) => {
    let response
    let _pet = { ...data }
    delete _pet.images
    setSending(true)
    if(_pet?.id)
      response = await updatePet({ ..._pet }, {id: _pet.id})
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
    if(_pet?.id && response?.id){
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
    if(id){
      getPet(id, user?.id).then(data => {
        if(user?.id != data.user && user?.role != 'admin')
          navigate(-1)
        else
          reset({
            id: data?.id || null,
            age: data?.age || "",
            name: data?.name || "",
            breed: data?.breed || "",
            weight: data?.weight || "",
            specie: data?.specie || "",
            gender: data?.gender || "",
            images: data?.images || [],
            age_unit: data?.unit || "months",
            description: data?.description || "",
            weight_unit: data?.unit || i18n.language == 'es' ? "kilograms" : "pounds",
          })
      })
    }
  }, []);

  return <div className="layout">
    <img className="layout__background" src="/assets/register/image-2.svg" />
    <div className="main__content xpadding-1">
      <form onSubmit={handleSubmit(onSubmit)} className="fullwidth">
        <h2>{watch('id') ? t('updatePetbtnText') : t('submitPetbtnText')}</h2>
        <div className="registerInput__container-x2">
          <TextInput
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
              showLabel={true}
              control={control}
              isRequired={true}
              nameInput="gender"
              labelName={t('inputRadioTitleText')}
              data={[
                { name: t("petGenderMaleText"), value: 'Male' },
                { name: t("petGenderFemaleText"), value: 'Female' },
              ]}
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
            nameInput="specie"
            optionLabel="name"
            optionValue="code"
            labelName={t('dropdownSpeciesTitleText')}
            getFormErrorMessage={getFormErrorMessage}
            placeHolderText={t('dropdownSpeciesPlaceholderText')}
            options={[
              { name: t('petTypeCatText'), code: "Cat" },
              { name: t('petTypeDogText'), code: "Dog" },
              { name: t('petTypeFishText'), code: "Fish" },
              { name: t('petTypeBirdText'), code: "Bird" },
              { name: t('petTypeRodentText'), code: "Rodent" },
              { name: t('petTypeReptileText'), code: "Reptile" },
              { name: t('petTypeFarmAnimalText'), code: "FarmAnimal" }
            ]}
            rules={{
              required: tGlobal('requiredErrorMessage'),
            }} />
          <TextInput
            showLabel={true}
            control={control}
            nameInput="breed"
            isRequired={true}
            labelName={t('inputBreedTitleText')}
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
          <div className="registerInput__container-age">
            <NumberInput
              maxLength={2}
              nameInput="age"
              showLabel={true}
              control={control}
              isRequired={true}
              maxFractionDigits={0}
              labelName={t('inputAgeTitleText')}
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
            <DropDownInput
              isEdit={true}
              control={control}
              showLabel={false}
              isRequired={true}
              optionLabel="name"
              optionValue="value"
              nameInput="age_unit"
              getFormErrorMessage={getFormErrorMessage}
              options={[
                {name: t('months'), value: 'months'},
                {name: t('years'), value: 'years'}
              ]}
              rules={{
                required: tGlobal('requiredErrorMessage'),
              }} />
          </div>
          <div className="registerInput__container-weight">
            <NumberInput
              showLabel={true}
              control={control}
              isRequired={true}
              nameInput="weight"
              labelName={t('inputWeightTitleText')}
              getFormErrorMessage={getFormErrorMessage}
              placeHolderText={t('inputWeightTitleText')}
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
            <DropDownInput
              isEdit={true}
              control={control}
              showLabel={false}
              isRequired={true}
              optionLabel="name"
              optionValue="value"
              nameInput="weight_unit"
              getFormErrorMessage={getFormErrorMessage}
              options={[
                {name: tMaterials('pounds'), value: 'pounds'},
                {name: tMaterials('kilograms'), value: 'kilograms'}
              ]}
              rules={{
                required: tGlobal('requiredErrorMessage'),
              }} />
          </div>
        </div>
        <div className="registerInput__container-x1">
          <TextAreaInput
            showLabel={true}
            control={control}
            isRequired={false}
            nameInput="description"
            labelName={t('textAreaPetDescriptionTitle')}
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
          <Button className="dark-blue fullwidth" label={id ? t('updatePetbtnText') : t('submitPetbtnText')} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default CreatePet