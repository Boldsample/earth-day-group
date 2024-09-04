import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useNavigate } from "react-router"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { setHeader } from "@store/slices/globalSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import { addImages, addProduct, updateProduct } from "@services/productServices"
import { TextInput, NumberInput, UploadPhotoInput, TextAreaInput, DropDownInput } from "@ui/forms"
import { useTranslation } from 'react-i18next'

const CreateProduct = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const numberInput = useRef(null)
  const [product, setProduct] = useState({})
  const [sending, setSending] = useState(false)
  const user = useSelector((state) => state.users.userData)
  const [t] = useTranslation('translation', { keyPrefix: 'vendor.products.createProduct'})
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const categories = [
    { name: "Self care", code: "Self care" }
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
      user: user?.id,
      name: product?.name || "",
      price: product?.price || "",
      images: product?.images || [],
      category: product?.category || "",
      description: product?.description || ""
    },
  })

  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const setUploadedImages = (images) => {
    setValue('images', images)
  }
  const onSubmit = async (data) => {
    let response
    let _product = { ...product, ...data }
    delete _product.images
    setSending(true)
    if(product?.id)
      response = await updateProduct({ ..._product }, {id: product.id})
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
    if(product?.id && response?.id){
      dispatch(updateThankyou({
        title: "Updated successfully!",
        link: `/product/${response?.id}/`,
        background: "image-1.svg",
        button_label: "Go to product",
        content: "Your product has updated successfully!",
      }))
      navigate('/thankyou/')
    }else if(response.id){
      dispatch(updateThankyou({
        title: "Congrats!",
        link: `/product/${response?.id}/`,
        background: "image-1.svg",
        button_label: "Go to product",
        content: "Your product was created!",
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
            labelName={t('inputTextProductNameLabel')}
            placeHolderText={t('inputTextProductNamePlaceholderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 100,
                message: tGlobal('inputMaxLengthErrorMessage', {maxLength: 100}),
              },
              required: tGlobal('requiredErrorMessage'),
              pattern: {
                value: /^\S/,
                message: tGlobal('patternErrorMessage'),
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
              required: tGlobal('requiredErrorMessage'),
            }} />
        </div>
        <div className="registerInput__container-x1">
          <NumberInput
            width="100%"
            disabled={false}
            control={control}
            nameInput="price"
            isRequired={true}
            inputRef={numberInput}
            labelName={t('inputNumberPriceLabel')}
            placeHolderText={t('inputNumberPricePlaceholderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 3,
                message: tGlobal('inputMaxLengthErrorMessage', {maxLength: 3}),
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
            label={t('textAreaProducttDescriptionLabel')}
            nameInput="description"
            placeHolderText={t('textAreaProductDescriptionPlaceholder')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 1000,
                message: tGlobal('inputMaxLengthErrorMessage', {maxLength: 100}),
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
          title="Add Images"
          uploadedImages={watch('images')}
          setUploadedImages={setUploadedImages} />
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
          <Button className="dark-blue fullwidth" label={product?.id ? t('updateProductBtn') : t('createProductBtn')} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default CreateProduct