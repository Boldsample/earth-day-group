import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useNavigate } from "react-router"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { setHeader } from "@store/slices/globalSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import { TextInput, NumberInput, UploadPhotoInput, TextAreaInput, DropDownInput } from "@ui/forms"
import { addImages, createproduct, updateProduct } from "@services/productServices"

const CreateProduct = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const numberInput = useRef(null)
  const [product, setProduct] = useState({})
  const [sending, setSending] = useState(false)
  const user = useSelector((state) => state.users.userData)
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
      shop: user?.id,
      user: user?.id,
      name: product?.name || "",
      price: product?.price || "",
      images: product?.images || [],
      catgory: product?.category || "",
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
      response = await createproduct({ ..._product })
    if(response.field){
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
      setSending(false)
      return
    }
    const _sendImages = data.images.map(image => {
      let _image = {...image}
      _image.user = response.id
      _image.type = 'product'
      return _image
    })
    await addImages(_sendImages)
    setSending(false)
    console.log(response)
    if(product?.id && response?.id){
      console.log(1)
      dispatch(updateThankyou({
        title: "Updated successfully!",
        link: `/product/${response?.id}/`,
        background: "image-1.svg",
        button_label: "Go to product",
        content: "Your product has updated successfully!",
      }))
      navigate('/thankyou/')
    }else if(response.id){
      console.log(2)
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
            labelName="Product Name"
            placeHolderText="Product Name*"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 20,
                message: "El campo supera los 20 caracteres",
              },
              required: "*El campo es requerido.",
              pattern: {
                value: /^\S/,
                message: "No debe tener espacios al inicio",
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
            labelName="Category"
            nameInput="category"
            placeHolderText="Select Category"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              required: "*El campo es requerido.",
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
            labelName="Unit Price"
            placeHolderText="Add Price per unit"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 3,
                message: "El campo supera los 3 caracteres",
              },
              required: "*El campo es requerido.",
              pattern: {
                value: /^\S/,
                message: "No debe tener espacios al inicio",
              },
            }} />
        </div>
        <div className="registerInput__container-x1">
          <TextAreaInput
            showLabel={true}
            control={control}
            isRequired={false}
            label="Product Detail*"
            nameInput="description"
            placeHolderText="Tell us about the product"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 230,
                message: "El campo supera los 230 caracteres",
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
          title="Add Images"
          uploadedImages={watch('images')}
          setUploadedImages={setUploadedImages} />
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
          <Button className="dark-blue fullwidth" label={product?.id ? "Update" : "Create"} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default CreateProduct