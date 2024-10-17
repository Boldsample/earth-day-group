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
  const [t] = useTranslation('translation', { keyPrefix: 'report.createReport' })
  const [tDropDown] = useTranslation('translation', { keyPrefix: 'admin.reportInfo' })
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
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
        title: t('reportCreatedthankyouPagetitle'),
        link: `/dashboard/`,
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
            optionValue="value"
            optionLabel="label"
            className=""
            control={control}
            isRequired={true}
            nameInput="subject"
            labelName={t('inputDropdownSubjectLabel')}
            getFormErrorMessage={getFormErrorMessage}
            placeHolderText={t('inputDropdownSubjectPlaceholderText')}
            options={reasons[type].map(reason => ({label: tDropDown(reason), value: reason})) }
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
            // labelName={`Name of ${type}`}
            labelName={t(`inputDropdownEntityLabel`, {userType: type})}
            placeHolderText={t('inputDropdownSubjectLabel')}
            getFormErrorMessage={getFormErrorMessage}
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
            // placeHolderText={`Tell why you want to report this ${type}.`}
            placeHolderText={t(`textAreaReportDescriptionPlaceholder`, {userType: type})}
            getFormErrorMessage={getFormErrorMessage}
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