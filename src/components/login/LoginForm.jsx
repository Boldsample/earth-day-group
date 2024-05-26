import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useFacebook } from "react-facebook"
import { useGoogleLogin } from "@react-oauth/google"

import { setHeader } from '@store/slices/globalSlice'
import { TextInput, PasswordInput } from "@ui/forms/"
import { authUser, getUserGoogle } from "@services/userServices"
import { getUserData, updateUser } from "@store/slices/usersSlice"

const LoginForm = () => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="main__content login-form">
      <h4 className="mb-1">Login to your account</h4>
      <div className="p-field mb-1">
        <label htmlFor="email">
          <TextInput
            disabled={false}
            isRequired={true}
            labelName="email"
            getFormErrorMessage={getFormErrorMessage}
            control={control}
            nameInput="email"
            placeHolderText="Email or username"
            rules={{
              maxLength: {
                value: 60,
                message: "El campo supera los 60 caracteres",
              },
              required: "*El campo es requerido.",
              pattern: {
                value: /^\S/,
                message: "No debe tener espacios al inicio",
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
            labelName="password"
            nameInput="password"
            placeHolderText="Password"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 60,
                message: "El campo supera los 60 caracteres",
              },
              required: "*El campo es requerido.",
              pattern: {
                value: /^\S/,
                message: "No debe tener espacios al inicio",
              }
            }} />
        </label>
      </div>
      <div className="p-field flex mb-1">
        <Link className="text-xs" to="/register/">Create a new account</Link>
        <Link className="text-xs" to="/forgot/">Forgot password?</Link>
      </div>
      <div className="p-field mb-2">
        <Button label="Login" type="submit" disabled={false} className="dark-blue fullwidth" loading={sending} />
      </div>
      <div className="p-field">
        <p className="text-center">Or sign in with</p>
        <p className="text-center">
          <a className="social-login" onClick={fLogin}><img src="/assets/icons/facebook.svg" alt="Facebook" /></a>
          <a className="social-login" onClick={gLogin}><img src="/assets/icons/google.svg" alt="Google" /></a>
        </p>
      </div>
    </form>
  </div>
}
export default LoginForm