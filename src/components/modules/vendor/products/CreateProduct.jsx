import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"

import { setHeader } from "@store/slices/globalSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import { addImages, addProduct, getProduct, updateProduct } from "@services/productServices"
import { TextInput, NumberInput, UploadPhotoInput, TextAreaInput, DropDownInput } from "@ui/forms"

const CreateProduct = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const user = useSelector((state) => state.users.userData)
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})
  const [tGlobalErrors] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const [t, i18n] = useTranslation('translation', { keyPrefix: 'vendor.products.createProduct'})
  const categories = [
    { name: t("food"), code: "food" },
    { name: t("care"), code: "care" },
    { name: t("home"), code: "home" },
    { name: t("fashion"), code: "fashion" },
    { name: t("babies"), code: "babies" },
    { name: t("health"), code: "health" },
    { name: t("transportation"), code: "transportation" },
    { name: t("office"), code: "office" },
  ]
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
      name: "",
      price: "",
      images: [],
      category: "",
      user: user?.id,
      description: "",
      currency: i18n.language == 'es' ? 'cop' : 'usd'
    },
  })

  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const setUploadedImages = (images) => {
    setValue('images', images)
  }
  const onSubmit = async (data) => {
    let response
    let _product = { ...data }
    delete _product.images
    setSending(true)
    if(_product?.id)
      response = await updateProduct({ ..._product }, {id: _product.id})
    else
      response = await addProduct({ ..._product })
    if(response.field){
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
      setSending(false)
      return
    }
    const _sendImages = data.images.map(image => {
      let _image = {...image}
      _image.type = 'product'
      _image.entity = response.id
      return _image
    })
    await addImages(_sendImages)
    setSending(false)
    if(_product?.id && response?.id){
      dispatch(updateThankyou({
        title: t('editProductthankyouPagetitle'),
        link: `/product/${response?.id}/`,
        background: "image-1.svg",
        button_label: t('editProductthankyouPagebuttonLabel'),
        content: t('editProductthankyouPagebodyText'),
      }))
      navigate('/thankyou/')
    }else if(response.id){
      dispatch(updateThankyou({
        title: t('createProductthankyouPagetitle'),
        link: `/product/${response?.id}/`,
        background: "image-1.svg",
        button_label: t('createProductthankyouPagebuttonLabel'),
        content: t('createProductthankyouPagebodyText'),
      }))
      navigate('/thankyou/')
    }
  }

  useEffect(() => {
    dispatch(setHeader("user"));
    if(id){
      getProduct(id, user?.id).then(data => {
        if(user?.id != data.user && user?.role != 'admin')
          navigate(-1)
        else
          reset({
            id: data?.id || null,
            name: data?.name || "",
            price: data?.price || "",
            images: data?.images || [],
            category: data?.category || "",
            description: data?.description || "",
            currency: data?.currency || i18n.language == 'es' ? 'cop' : 'usd'
          })
      })
    }
  }, []);

  return <div className="layout">
    <img className="layout__background" src="/assets/register/image-2.svg" />
    <div className="main__content xpadding-1">
      <form onSubmit={handleSubmit(onSubmit)} className="fullwidth">
        <h2>{watch('id') ? t('updateProductBtn') : t('createProductBtn')}</h2>
        <div className="registerInput__container-x2">
          <TextInput
            nameInput="name"
            control={control}
            isRequired={true}
            labelName={t('inputTextProductNameLabel')}
            placeHolderText={t('inputTextProductNamePlaceholderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 100,
                message: tGlobalErrors('inputMaxLengthErrorMessage', {maxLength: 100}),
              },
              required: tGlobalErrors('requiredErrorMessage'),
              pattern: {
                value: /^\S/,
                message: tGlobalErrors('patternErrorMessage'),
              },
            }} />
          <DropDownInput
            className=""
            isEdit={true}
            control={control}
            isRequired={true}
            optionLabel="name"
            optionValue="code"
            options={categories}
            labelName={t('inputDropdownSubjectLabel')}
            nameInput="category"
            placeHolderText={t('inputDropdownSubjectPlaceholderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              required: tGlobalErrors('requiredErrorMessage'),
            }} />
        </div>
        <div className="registerInput__container-x2">
          <NumberInput
            mode="currency"
            disabled={false}
            control={control}
            nameInput="price"
            isRequired={true}
            labelName={t('inputNumberPriceLabel')}
            getFormErrorMessage={getFormErrorMessage}
            placeHolderText={t('inputNumberPricePlaceholderText')}
			maxFractionDigits={watch('currency') == 'cop' ? 0 : 2}
            rules={{
              maxLength: {
                value: 3,
                message: tGlobalErrors('inputMaxLengthErrorMessage', {maxLength: 3}),
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
        </div>
        <div className="registerInput__container-x1">
          <TextAreaInput
            showLabel={true}
            control={control}
            isRequired={false}
            nameInput="description"
            labelName={t('textAreaProducttDescriptionLabel')}
            placeHolderText={t('textAreaProductDescriptionPlaceholder')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 1000,
                message: tGlobalErrors('inputMaxLengthErrorMessage', {maxLength: 100}),
              },
              required: tGlobalErrors('requiredErrorMessage'),
              pattern: {
                value: /^\S/,
                message: tGlobalErrors('patternErrorMessage'),
              },
            }} />
        </div>
        <UploadPhotoInput
          type="imageUpload"
          title="Add Images"
          uploadedImages={watch('images')}
          setUploadedImages={setUploadedImages} />
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
          <Button className="dark-blue fullwidth" label={watch('id') ? t('updateProductBtn') : t('createProductBtn')} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default CreateProduct