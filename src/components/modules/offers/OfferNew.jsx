import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from 'react-i18next'

import { setHeader } from "@store/slices/globalSlice"
import materials from "@json/recyclableMaterials.json"
import { addImages, createOffer } from "@services/offersServices"
import { TextInput, NumberInput, DropDownInput, UploadPhotoInput } from "@ui/forms"

import "@components/register/style.sass"

const OfferNew = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const userId = useSelector((state) => state.users.userData.id)
  const [t] = useTranslation('translation', { keyPrefix: 'offers.offerNew'})
  const [tMaterial] = useTranslation('translation', {keyPrefix: 'materials'})
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      price: "",
      user: userId,
      material: "",
      quantity: "",
    },
  })
  const translatedMaterials = materials.map(group => ({
    ...group,
    label: tMaterial(group.label),
    items: group.items.map(item => ({
      ...item,
      label: tMaterial(item.label),
    }))
  }));

  const getFormErrorMessage = (fieldName) =>
    errors[fieldName] && (
      <small className="p-error">{errors[fieldName]?.message}</small>
    );
  const onSubmit = async (data) => {
    setSending(true)
    const id = await createOffer(data)
    const _sendImages = uploadedImages.map(image => {
      let _image = {...image}
      _image.entity = id
      _image.type = 'offers'
      return _image
    })
    await addImages(_sendImages)
    setSending(false)
    toast.success('The offer was created successfully');
    navigate("/offers")
  };

  useEffect(() => {
    dispatch(setHeader("user"))
  }, [])

  return <div className="layout">
    <img className="layout__background" src="/assets/user/image-2.svg" />
    <div className="main__content xpadding-1">
      <h4 className="text-defaultCase text-dark-blue">
        <i className="pi pi-tag" /> {t('mainTitle')}
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} className="fullwidth">
        <div className="registerInput__container-x2">
          <TextInput
            width="100%"
            isEdit={true}
            control={control}
            showLabel={false}
            isRequired={true}
            labelName={t('inputTitleLabel')}
            nameInput="title"
            placeHolderText={t('inputTitlePlaceholderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 60,
                message: tGlobal('inputMaxLengthErrorMessage', {maxLength: 60}),
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
      optionLabel="label"
      optionValue="label"
            nameInput="material"
      optionGroupLabel="label"
      optionGroupChildren="items"
            options={translatedMaterials}
            labelName={t('inputDropdownMaterialLabel')}
            placeHolderText={t('inputDropdownMaterialPlaceholderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              required: tGlobal('requiredErrorMessage'),
            }}
              />
        </div>
        <div className="registerInput__container-x2">
          <NumberInput
            width="100%"
            control={control}
            showLabel={false}
            isRequired={true}
            nameInput="quantity"
            label={t('inputNumberQuantityLabel')}
            placeHolderText={t('inputNumberQuantityPlaceholderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 7,
                message: tGlobal('inputMaxLengthErrorMessage', {maxLength: 7}),
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
            nameInput="unit"
            labelName={t('inputDropdownUnitLabel')}
            placeHolderText={t('inputDropdownUnitPlaceholderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              required: tGlobal('requiredErrorMessage'),
            }}
            options={[
              {label: t('unitLabelKg'), value: "Kg"}, 
              {label: t('unitLabelCc'), value: "cc"},
              {label:  t('unitLabelUnit'), value: "Units"}
            ]} />
            
        </div>
        <div className="registerInput__container-x2">
        <NumberInput
          width="100%"
          mode="currency"
          showLabel={false}
          control={control}
          nameInput="price"
          isRequired={true}
          label={t('inputNumberAskingPriceLabel')}
          placeHolderText={t('inputNumberAskingPricePlaceholderText')}
          getFormErrorMessage={getFormErrorMessage}
          rules={{
            maxLength: {
              value: 7,
              message: tGlobal('inputMaxLengthErrorMessage', {maxLength: 7}),
            },
            required: tGlobal('requiredErrorMessage'),
            pattern: {
              value: /^\S/,
              message: tGlobal('patternErrorMessage'),
            },
          }} />
        </div>
        <UploadPhotoInput
          type="imageUpload"
          title={t('offerImagesTitle')}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
          className="imagesHub__container-variant mb-1" />
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
          <Button className="dark-blue fullwidth" label={t('postOfferBtnText')} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default OfferNew