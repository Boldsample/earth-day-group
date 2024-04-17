import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { useGoogleLogin } from "@react-oauth/google"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
//import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

import { setHeader } from '@store/slices/globalSlice'
import { TextInput, PasswordInput } from "@ui/forms/"
import { authUser, getUserGoogle } from "@services/userServices"
import { getUserData, updateUser } from "@store/slices/usersSlice"

const LoginForm = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [sending, setSending] = useState(false)
	const userInfo = useSelector((state) => state.users)
	const {
		reset,
		control,
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
		if(await authUser(data))
			dispatch(getUserData())
	}
	const gLogin = useGoogleLogin({
		onSuccess: async ({access_token}) => {
			const { name, email, picture, locale } = await getUserGoogle(access_token)
			dispatch(updateUser({google_token: access_token, name, email, picture, locale, email_verified_at: new Date().toISOString().replace('T', ' ').substring(0, 19)}))
			navigate('/register/')
		}
	})
	// const fLogin = ({name, email, picture, accessToken}) => {
	// 	dispatch(updateUser({ facebook_token: accessToken, name, email, picture: picture.data.url, email_verified_at: new Date().toISOString().replace('T', ' ').substring(0, 19) }))
	// 	navigate('/register/')
	// }

	useEffect(() => {
		dispatch(updateUser({}))
		dispatch(setHeader('login'))

	}, [])

	return <div>
		<div className="layout">
			<img className="layout__background" src="/assets/login/image-1.svg" />
			<form onSubmit={handleSubmit(onSubmit)} className="main__content login-form">
				<h4 className="mb-1">Login to your account</h4>
				<div className="p-field mb-1">
					<label htmlFor="email">
						<TextInput
							isRequired={true}
							labelName="email"
							disabled={sending}
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
							}}
						/>
					</label>
				</div>
				<div className="p-field mb-1">
					<label htmlFor="password">
						<PasswordInput
							feedback={false}
							control={control}
							isRequired={true}
							disabled={sending}
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
							}}
						/>
					</label>
				</div>
				<div className="p-field flex mb-1">
					<Link className="text-xs" to="/register/">Create a new account</Link>
					<Link className="text-xs" to="/recover/">Forgot password?</Link>
				</div>
				<div className="p-field mb-2">
					<Button label="Login" type="submit" disabled={sending} className="dark-blue fullwidth" />
				</div>
				<div className="p-field">
					<p className="text-center">Or sign in with</p>
					<p className="text-center">
						<a className="social-login"><img src="/assets/icons/facebook.svg" alt="Facebook" /></a>
						{/* <FacebookLogin
							autoLoad={true}
							callback={fLogin}
							appId="1357569244808289"
							fields="name,email,picture"
							render={renderProps => (
								<a className="social-login" onClick={renderProps.onClick}><img src="/assets/icons/facebook.svg" alt="Facebook" /></a>
							)} /> */}
						<a className="social-login" onClick={gLogin}><img src="/assets/icons/google.svg" alt="Google" /></a>
					</p>
				</div>
			</form>
		</div>
	</div>
}
export default LoginForm