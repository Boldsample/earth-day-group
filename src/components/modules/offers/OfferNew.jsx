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
import { TextInput, NumberInput, DropDownInput, UploadPhotoInput, TextAreaInput } from "@ui/forms"

import "@components/register/style.sass"

const OfferNew = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const userId = useSelector((state) => state.users.userData.id)
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})
  const [tMaterial] = useTranslation('translation', {keyPrefix: 'materials'})
  const [t, i18n] = useTranslation('translation', { keyPrefix: 'offers.offerNew'})
  const [tGlobalErrors] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const {
    watch,
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
      description: "",
      delivery_currency: i18n.language == 'es' ? 'cop' : 'usd'
    },
  })

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
            isEdit={true}
            control={control}
            isRequired={true}
            labelName={t('inputTitleLabel')}
            nameInput="title"
            placeHolderText={t('inputTitlePlaceholderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 60,
                message: tGlobalErrors('inputMaxLengthErrorMessage', {maxLength: 60}),
              },
              required: tGlobalErrors('requiredErrorMessage'),
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
            nameInput="material"
            optionGroupLabel="label"
            optionGroupChildren="items"
            options={materials?.map(group => ({
              ...group,
              label: tMaterial(group?.label),
              items: group?.items.map(item => ({
                label: tMaterial(item?.label),
                value: item?.label
              }))
            }))}
            labelName={t('inputDropdownMaterialLabel')}
            placeHolderText={t('inputDropdownMaterialPlaceholderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              required: tGlobalErrors('requiredErrorMessage'),
            }}
              />
        </div>
        <div className="registerInput__container-x2">
          <NumberInput
            control={control}
            isRequired={true}
            nameInput="quantity"
            labelName={t('inputNumberQuantityLabel')}
            getFormErrorMessage={getFormErrorMessage}
            placeHolderText={t('inputNumberQuantityPlaceholderText')}
            rules={{
              maxLength: {
                value: 7,
                message: tGlobalErrors('inputMaxLengthErrorMessage', {maxLength: 7}),
              },
              required: tGlobalErrors('requiredErrorMessage'),
              pattern: {
                value: /^\S/,
                message: tGlobalErrors('patternErrorMessage'),
              },
            }} />
          <DropDownInput
            isEdit={true}
            nameInput="unit"
            control={control}
            isRequired={true}
            optionLabel="label"
            optionValue="value"
            labelName={t('inputDropdownUnitLabel')}
            getFormErrorMessage={getFormErrorMessage}
            placeHolderText={t('inputDropdownUnitPlaceholderText')}
            rules={{
              required: tGlobalErrors('requiredErrorMessage'),
            }}
            options={materials?.flatMap(category => category?.items)?.find(item => item?.label == watch('material'))?.units?.map(unit => ({label: tMaterial(unit), value: unit})) || []} />
        </div>
        <div className="registerInput__container-x2">
          <NumberInput
            mode="currency"
            control={control}
            nameInput="price"
            isRequired={true}
            getFormErrorMessage={getFormErrorMessage}
            labelName={t('inputNumberAskingPriceLabel')}
            placeHolderText={t('inputNumberAskingPricePlaceholderText')}
			      maxFractionDigits={watch('delivery_currency') == 'cop' ? 0 : 2}
            rules={{
              maxLength: {
                value: 7,
                message: tGlobalErrors('inputMaxLengthErrorMessage', {maxLength: 7}),
              },
              required: tGlobalErrors('requiredErrorMessage'),
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
            nameInput="delivery_currency"
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
        </div>
        <div className="registerInput__container-x1">
          <TextAreaInput
            control={control}
            isRequired={true}
            nameInput="description"
            getFormErrorMessage={getFormErrorMessage}
            labelName={t('textAreaDescriptionTitle')}
            placeHolderText={t('descriptionPlaceholder')}
            rules={{
              required: tGlobalErrors('requiredErrorMessage'),
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
          isRequired={true}
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