import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"

import reasons from "@json/reportReasons.json"
import { setHeader } from "@store/slices/globalSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import { addImages, addReport, getEntity } from "@services/reportServices"
import { UploadPhotoInput, TextAreaInput, DropDownInput } from "@ui/forms"

const CreateReport = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { type, entityID } = useParams()
  const [entity, setEntity] = useState([])
  const [sending, setSending] = useState(false)
  const user = useSelector((state) => state.users.userData)
  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: type,
      images: [],
      subject: "",
      user: user?.id,
      description: "",
      entity: entityID,
    },
  })

  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const setUploadedImages = (images) => {
    setValue('images', images)
  }
  const onSubmit = async (data) => {
    let response
    let _report = { ...data }
    delete _report.images
    setSending(true)
    response = await addReport({ ..._report })

    if(response.field){
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
      setSending(false)
      return
    }
    const _sendImages = data.images.map(image => {
      let _image = {...image}
      _image.type = 'report'
      _image.entity = response.id
      return _image
    })
    await addImages(_sendImages)
    setSending(false)
    if(response.id){
      dispatch(updateThankyou({
        title: "Congrats!",
        link: `/dashboard/`,
        background: "image-1.svg",
        button_label: "Go back to dashboard",
        content: "Your report was sended. We will contact you to solve your concerns!",
      }))
      navigate('/thankyou/')
    }
  }

  useEffect(() => {
      dispatch(setHeader("user"));
      if(entity?.length <= 0)
        getEntity(type, entityID).then(data => {
          setValue('entity', data[0].id)
          setEntity(data)
        })
  }, []);

  return <div className="layout">
    <img className="layout__background" src="/assets/register/image-2.svg" />
    <div className="main__content xpadding-1">
      <form onSubmit={handleSubmit(onSubmit)} className="fullwidth">
        <div className="registerInput__container-x2">
          <DropDownInput
            className=""
            control={control}
            isRequired={true}
            nameInput="subject"
            labelName="Subject"
            getFormErrorMessage={getFormErrorMessage}
            placeHolderText="Select a reason to report"
            options={reasons[type]}
            rules={{
              required: "*El campo es requerido.",
            }} />
          <DropDownInput
            className=""
            disabled={true}
            optionValue="id"
            options={entity}
            control={control}
            isRequired={true}
            nameInput="entity"
            optionLabel="name"
            labelName={`Name of ${type}`}
            placeHolderText="Select an entity"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              required: "*El campo es requerido.",
            }} />
        </div>
        <div className="registerInput__container-x1">
          <TextAreaInput
            showLabel={true}
            control={control}
            isRequired={false}
            nameInput="description"
            label="Describe your report*"
            placeHolderText={`Tell why you want to report this ${type}.`}
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
          title="Report images"
          uploadedImages={watch('images')}
          setUploadedImages={setUploadedImages} />
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
          <Button className="dark-blue fullwidth" label="Create" type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default CreateReport