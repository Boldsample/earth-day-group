import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useFacebook } from "react-facebook"
import { useGoogleLogin } from "@react-oauth/google"
import { useTranslation } from 'react-i18next'
import { setHeader } from '@store/slices/globalSlice'
import { TextInput, PasswordInput } from "@ui/forms/"
import { getUserData } from "@store/slices/usersSlice"
import { authUser, getUserGoogle } from "@services/userServices"


const LoginForm = () => {
  const [t, i18next] = useTranslation('translation', { keyPrefix: 'login.loginForm' })
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const dispatch = useDispatch()
  const [ fApi, setFApi ] = useState()
  const { isLoading, init } = useFacebook()
  const [sending, setSending] = useState(false)
  const {
    control,
    setError,
    setFocus,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
  })
  
  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const onSubmit = async (data) => {
    setSending(true)
    const response = await authUser(data)
    setSending(false)
    if(response?.id)
      dispatch(getUserData(response.id))
    else{
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
    }
  }
  const gLogin = useGoogleLogin({
    onSuccess: async ({access_token}) => {
      const { name, email, picture, locale } = await getUserGoogle(access_token)
      if(await authUser({email}))
        dispatch(getUserData())
    }
  })
  const fLogin = async () => {
    fApi.login(function({authResponse}){
      if(authResponse){
        fApi.api('/me', {fields: 'name, email'}, async ({email}) => {
          if(await authUser({email}))
            dispatch(getUserData())
        });
      }else
      toast.error('User cancelled login or did not fully authorize.');
    });
  }
  
  useEffect(() => {
    if(!isLoading){
      if(!fApi)
        init()
      .then(response => response.getFB())
      .then(response => setFApi(response))
      else{
        fApi.getLoginStatus(({authResponse}) => {
          if(authResponse)
            FB.logout()
        })
      }
    }
    dispatch(setHeader('login'))
  }, [isLoading, fApi])
  
  return <div className="layout">
    <img className="layout__background" src="/assets/login/image-1.svg" />
    <form onSubmit={handleSubmit(onSubmit)} className="main__content verticalcenter-2 xpadding-1">
      <h4 className="mb-1">{t('mainTitle')}</h4>
      <div className="p-field mb-1">
        <label htmlFor="email">
          <TextInput
            disabled={false}
            control={control}
            isRequired={true}
            labelName="Email"
            showLabel={false}
            nameInput="email"
            placeHolderText={t('emailPlaceHolderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 60,
                message: tGlobal('inputMaxLengthErrorMessage', {maxLength: 60}),
              },
              required: tGlobal('requiredErrorMessage'),
              pattern: {
                value: /^\S/,
                message: tGlobal('patternErrorMessage'),
              }
            }} />
        </label>
      </div>
      <div className="p-field mb-1">
        <label htmlFor="password">
          <PasswordInput
            disabled={false}
            feedback={false}
            control={control}
            showLabel={false}
            isRequired={true}
            labelName="Password"
            nameInput="password"
            placeHolderText={t('passwordPlaceHolderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 60,
                message: tGlobal('inputMaxLengthErrorMessage', {maxLength: 60}),
              },
              required: tGlobal('requiredErrorMessage'),
              pattern: {
                value: /^\S/,
                message: tGlobal('patternErrorMessage'),
              }
            }} />
        </label>
      </div>
      <div className="p-field flex mb-1">
        <Link className="text-xs" to="/register/">{t('dontHaveAccount')}</Link>
        <Link className="text-xs" to="/forgot/">{t('forgotPassword')}</Link>
      </div>
      <div className="p-field mb-2">
        <Button label={t('loginformBtn')} type="submit" disabled={false} className="dark-blue fullwidth" loading={sending} />
      </div>
      <div className="p-field">
        <p className="text-center">{t('signInWith')}</p>
        <p className="text-center">
          <a className="social-login" onClick={fLogin}><img src="/assets/icons/facebook.svg" alt="Facebook" /></a>
          <a className="social-login" onClick={gLogin}><img src="/assets/icons/google.svg" alt="Google" /></a>
        </p>
      </div>
    </form>
  </div>
}
export default LoginForm