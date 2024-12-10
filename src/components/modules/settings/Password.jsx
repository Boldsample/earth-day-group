import { useForm } from 'react-hook-form'
import { PasswordInput } from '@ui/forms'
import { Button } from 'primereact/button'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { authUser, updateUser } from '@services/userServices'
import PasswordRequirements from '@ui/templates/PasswordRequirements'
import { setHeader, setHeaderTitle, updateThankyou } from '@store/slices/globalSlice'

import "./styles.sass"

const Password = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
	const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})
	const [tGlobalErrors] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const user = useSelector((state) => state.users.userData)
  const {
    watch,
    control,
    setFocus,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      new_password: "",
      password_confirmation: "",
    },
  })
  
  const getFormErrorMessage = fieldName => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const onSubmit = async (data) => {
    let response
    setSending(true)
    response = await authUser({email: user?.username, password: data.password})
    if(response?.id)
      response = await updateUser({ password: data.new_password }, {id: response?.id})
    setSending(false)
    if(response?.id){
      dispatch(updateThankyou({
        title: tGlobal('updateUserTitleThankYouPage'),
        link: '/settings/',
        background: "image-1.svg",
        button_label: tGlobal('updateUserBtnLabelThankYouPage3'),
        content: tGlobal('updateUsercontentText'),
      }))
      navigate('/thankyou/')
    }else{
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
      return
    }
  }

	useEffect(() => {
		dispatch(setHeader('settings'))
		dispatch(setHeaderTitle('changePasswordBtnText'))
	}, [])

	return <div className="layout" style={{background: 'white'}}>
		<div className="main__content centerwidth">
      <form onSubmit={handleSubmit(onSubmit)} className="fullwidth">
        <div className="password-container">
          <PasswordInput
            disabled={false}
            feedback={false}
            control={control}
            isRequired={true}
            nameInput="password"
            getFormErrorMessage={getFormErrorMessage}
            labelName={tGlobal('userPasswordInputLabel')}
            placeHolderText={tGlobal('changePasswordPlaceholder1')}
            rules={{
              maxLength: {
                value: 60,
                message: tGlobalErrors('inputMaxLengthErrorMessage', {maxLength: 60}),
              },
              required: tGlobalErrors('requiredErrorMessage'),
              pattern: {
                value: /^\S/,
                message: tGlobalErrors('patternErrorMessage'),
              }
            }} />
          <PasswordInput
            maxLength={20}
            control={control}
            isRequired={true}
            nameInput="new_password"
            getFormErrorMessage={getFormErrorMessage}
            passwordRequirementsPopUp={PasswordRequirements}
            labelName={tGlobal('userNewPasswordPlaceHolderText')}
            placeHolderText={tGlobal('changePasswordPlaceholder2')}
            rules={{
              maxLength: {
                value: 20,
                message: tGlobalErrors(`inputMaxLengthErrorMessage`, {maxLength: 20})
              },
              required: tGlobalErrors('requiredErrorMessage'),
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
                message:
                  tGlobalErrors('passwordPatternErrorMessage'),
              },
            }} />
          <PasswordInput
            maxLength={20}
            feedback={false}
            showLabel={true}
            control={control}
            isRequired={true}
            nameInput="password_confirmation"
            getFormErrorMessage={getFormErrorMessage}
            labelName={tGlobal('changePasswordPlaceholder3')}
            placeHolderText={tGlobal('changePasswordPlaceholder3')}
            rules={{
              required: tGlobalErrors('requiredErrorMessage'),
              validate: value => value === watch('new_password') || tGlobalErrors('passwordDoNotMatchErrorMessage'),
            }} />
        </div>
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
          <Button className="dark-blue fullwidth" label={tGlobal('saveBtnText')} type="submit" loading={sending} />
        </div>
      </form>
		</div>
	</div>
}

export default Password