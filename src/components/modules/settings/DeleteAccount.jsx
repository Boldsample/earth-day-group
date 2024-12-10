import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { PasswordInput } from '@ui/forms'
import { resetState } from '@store/slices/usersSlice'
import { updateThankyou } from '@store/slices/globalSlice'
import { authUser, logoutUser, updateUser } from '@services/userServices'

const DeleteAccount = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const user = useSelector((state) => state.users.userData)
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})
  const [t] = useTranslation('translation', { keyPrefix: 'settings.deleteAccount'})
  const [tGlobalErrors] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const {
    control,
    setFocus,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
    },
  })

  const getFormErrorMessage = fieldName => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const onSubmit = async (data) => {
    let response
    setSending(true)
    response = await authUser({email: user?.username, password: data.password})
    if(response?.id)
      response = await updateUser({ state: 3 }, {id: response?.id})
    setSending(false)
    if(response?.id){
      if(await logoutUser())
        dispatch(resetState())
      dispatch(updateThankyou({
        title: tGlobal('updateUserTitleThankYouPage'),
        link: '/login/',
        background: "image-1.svg",
        button_label: tGlobal('exit'),
        content: tGlobal('userDeletedAccount'),
      }))
      navigate('/thankyou/')
    }else{
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
      return
    }
  }

  return <div className="layout" style={{background: 'white'}}>
    <div className="main__content centerwidth alignttop">
      <form onSubmit={handleSubmit(onSubmit)} className="settings__card">
        <h4 className='mb-2 text-green-earth'>{t('mainTitle')}</h4>
        <p className='text-left mb-2'>{t('secondaryTitle')}</p>
        <ul className='text-left ml-1'>
            {/* <li className='mb-1'><b className='text-green-earth'>{t('listItem1Title')}</b> {t('listItem1')}</li> */}
            <li className='mb-1'><b className='text-green-earth'>{t('listItem2Title')}</b> {t('listItem2')}</li>
            <li className='mb-1'><b className='text-green-earth'>{t('listItem3Title')}</b> {t('listItem3')}</li>
            <li className='mb-1'><b className='text-green-earth'>{t('listItem4Title')}</b> {t('listItem4')}.</li>
        </ul>
        <p className='text-left mt-2'>{t('deleteConfirmationText')}</p>
        <div className="registerInput__container-x1 text-left">
          <PasswordInput
            disabled={false}
            feedback={false}
            control={control}
            isRequired={true}
            nameInput="password"
            getFormErrorMessage={getFormErrorMessage}
            labelName={tGlobal('userPasswordInputLabel')}
            placeHolderText={tGlobal('deleteAccountPlaceHolder')}
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
        </div>
        <Button className="red-state" label={t('deleteAccountBtn')} type="submit" loading={sending} />
      </form>
    </div>
  </div>
}

export default DeleteAccount