import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useFacebook } from "react-facebook"
import { useTranslation } from "react-i18next"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useGoogleLogin } from "@react-oauth/google"

import { setHeader } from "@store/slices/globalSlice"
import { TextInput, PasswordInput } from "@ui/forms/"
import { getUserData } from "@store/slices/usersSlice"
import { authUser, getUser, getUserGoogle, updateUser } from "@services/userServices"
import { Message } from "primereact/message"

const LoginForm = () => {
  const {token} = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [fApi, setFApi] = useState()
  const {isLoading, init} = useFacebook()
  const [sending, setSending] = useState(false)
  const [verification, setVerification] = useState(false)
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const [t] = useTranslation('translation', { keyPrefix: 'login.loginForm' })
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
  
  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{tGlobal(errors[fieldName]?.message)}</small>
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
  const tokenLogin = async () => {
    if(token){
      setSending(true)
      const response = await updateUser({email_verified_at: 1, remember_token: ''}, {remember_token: token})
      if(response?.response == 'Ok'){
        setVerification(true)
        navigate('/login/')
      }
      setSending(false)
    }
  }
  
  useEffect(() => {
    tokenLogin()
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
      {verification && 
        <Message severity="success" text={t('emailVerified')} className="mb-2" />
      }
      <div className="p-field mb-1">
        <label htmlFor="email">
          <TextInput
            disabled={false}
            control={control}
            isRequired={true}
            nameInput="email"
            labelName={t('emailPlaceHolderText')}
            getFormErrorMessage={getFormErrorMessage}
            placeHolderText={t('emailPlaceHolderText')}
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
            isRequired={true}
            nameInput="password"
            labelName={t('passwordPlaceHolderText')}
            getFormErrorMessage={getFormErrorMessage}
            placeHolderText={t('passwordPlaceHolderText')}
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