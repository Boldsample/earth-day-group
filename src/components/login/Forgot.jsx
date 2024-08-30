import { useDispatch } from 'react-redux'
import { Button } from 'primereact/button'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'

import { recoverUser } from '@services/userServices'
import { setHeader, updateThankyou } from '@store/slices/globalSlice'
import { useForm } from 'react-hook-form'
import { TextInput } from '@ui/forms'
import { useTranslation } from 'react-i18next'

const Forgot = () => {
  const [t, i18next] = useTranslation('translation', { keyPrefix: 'login.forgot' })
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [sending, setSending] = useState(false)
  const {
    control,
    setError,
    setFocus,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: ""
    },
  })
  const forgotTitle = t('title'); // "Forgot Password?"

  console.log(forgotTitle);

  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const onSubmit = async (data) => {
    setSending(true)
    const response = await recoverUser(data)
    setSending(false)
    if(response?.id){
      dispatch(updateThankyou({
        title: t('forgotthankyouPagetitle'),
        link: "/login/",
        background: "image-1.svg",
        button_label: t('forgotthankyouPagebuttonLabel'),
        content: t('forgotthankyouPagebodyText'),
      }))
      navigate('/thankyou/')
    }else{
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
    }
  }

  useEffect(() => {
    dispatch(setHeader('register'))
  }, [])

  return <div className="layout">
      <img className="layout__background" src="/assets/login/image-1.svg" />
    <form onSubmit={handleSubmit(onSubmit)} className="main__content verticalcenter-2 xpadding-1">
      <h4 className="mb-1">{t(`title`)}</h4>
      <p>{t(`bodyText`)}</p>
      <div className="p-field mb-1">
        <TextInput
          width="100%"
          isEdit={true}
          control={control}
          nameInput="email"
          isRequired={true}
          labelName="E-mail"
          placeHolderText="johndoe@sample.com"
          getFormErrorMessage={getFormErrorMessage}
          rules={{
            maxLength: {
              value: 60,
              message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 60}),
            },
            required: tGlobal(`requiredErrorMessage`),
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: tGlobal(`validEmailAddressErrorMessage`),
            },
          }} />
      </div>
      <div className="p-field mb-2">
        <Button label={t(`sendformBtnText`)} type="submit" disabled={false} className="dark-blue fullwidth" loading={sending} />
      </div>
    </form>
  </div>
}
export default Forgot