import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from 'react-i18next'

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
  const article = ['offer', 'pet'].some(t => t == type) ? 'la' : 'el'
  const [t] = useTranslation('translation', { keyPrefix: 'report.createReport' })
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const [tDropDown] = useTranslation('translation', { keyPrefix: 'admin.reportInfo' })
  const simpleType = ['offer', 'product', 'pet'].some(t => t == type) ? type : 'user'
  const returnURL = {
    user: `/chat/${entityID}/`,
    company: `/company/${entityID}/`,
    vendor: `/vendor/${entityID}/`,
    ngo: `/ngo/${entityID}/`,
    shelter: `/shelter/${entityID}/`,
    social: `/social/${entityID}/`,
    offer: `/offers/${entityID}/`,
    product: `/${type}/${entityID}/`,
    pet: `/${type}/${entityID}/`
  }
  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      images: [],
      subject: "",
      user: user?.id,
      description: "",
      type: simpleType,
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
        title: t('reportCreatedthankyouPagetitle'),
        link: returnURL[type],
        background: "image-1.svg",
        button_label: t('reportCreatedthankyouPagebuttonLabel'),
        content: t('reportCreatedthankyouPagebodyText'),
      }))
      navigate('/thankyou/')
    }
  }

  useEffect(() => {
      dispatch(setHeader("user"));
      if(entity?.length <= 0)
        getEntity(simpleType, entityID).then(data => {
          if(data){
            setValue('entity', data[0]?.id)
            setEntity(data)
          }
        })
  }, []);

  return <div className="layout">
    <img className="layout__background" src="/assets/register/image-2.svg" />
    <div className="main__content xpadding-1">
      <form onSubmit={handleSubmit(onSubmit)} className="fullwidth">
        <div className="registerInput__container-x2">
          <DropDownInput
            optionValue="value"
            optionLabel="label"
            className=""
            control={control}
            isRequired={true}
            nameInput="subject"
            labelName={t('inputDropdownSubjectLabel')}
            getFormErrorMessage={getFormErrorMessage}
            placeHolderText={t('inputDropdownSubjectPlaceholderText')}
            options={reasons[simpleType]?.map(reason => ({label: tDropDown(reason), value: reason})) }
            rules={{
              required: tGlobal(`requiredErrorMessage`),
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
            getFormErrorMessage={getFormErrorMessage}
            placeHolderText={t('inputDropdownSubjectLabel')}
            labelName={t(`inputDropdownEntityLabel`, {article: article, userType: tDropDown(simpleType)})}
            rules={{
              required: tGlobal(`requiredErrorMessage`),
            }} />
        </div>
        <div className="registerInput__container-x1">
          <TextAreaInput
            showLabel={true}
            control={control}
            isRequired={false}
            nameInput="description"
            label="Describe your report*"
            getFormErrorMessage={getFormErrorMessage}
            placeHolderText={t(`textAreaReportDescriptionPlaceholder`, {article: article, userType: tDropDown(simpleType)})}
            rules={{
              maxLength: {
                value: 1000,
                message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 1000}),
              },
              required: tGlobal(`requiredErrorMessage`),
              pattern: {
                value: /^\S/,
                message: tGlobal('patternErrorMessage'),
              },
            }} />
        </div>
        <UploadPhotoInput
          type="imageUpload"
          title={t('ReportImagesTitle')}
          uploadedImages={watch('images')}
          setUploadedImages={setUploadedImages} />
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
          <Button className="dark-blue fullwidth" label={t('createReportBtn')} type="submit" loading={sending} />
        </div>
      </form>
    </div>
  </div>
}

export default CreateReport