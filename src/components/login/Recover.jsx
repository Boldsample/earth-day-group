import { useDispatch } from "react-redux"
import { Button } from "primereact/button"
import { useState, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

import { PasswordInput } from "@ui/forms"
import { recoverUser, updateUser } from "@services/userServices"
import { setHeader, updateThankyou } from "@store/slices/globalSlice"

const Recover = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
  const { token } = useParams()
	const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
	const {
		control,
    setError,
    setFocus,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			password: "",
			password_confirmation: ""
		}
	})

	const onSubmit = async (data) => {
    setSending(true)
    delete data?.password_confirmation
		const response = await updateUser(data, {remember_token: token})
    if(response?.id){
      dispatch(updateThankyou({
        title: "Password updated successfully!",
        link: "/login/",
        background: "image-1.svg",
        button_label: "Go back to login",
        content: "Your password has been registered successfully!",
      }))
      navigate('/thankyou/')
    }else{
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
    }
    setSending(false)
	}
	const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>

	useEffect(() => {
		dispatch(setHeader('register'))
	}, [])

	return <form onSubmit={handleSubmit(onSubmit)}>
		<div className="layout">
			<img className="layout__background" src="/assets/login/image-1.svg" />
			<div className="main__content verticalcenter-2 xpadding-1">
				<h1 className="text-upperCase mb-1">Recover</h1>
				<p>Please enter a new password.</p>
				<div className="registerInput__container-x2">
					<PasswordInput
						width="100%"
						maxLength={20}
						label="Password"
						control={control}
						showLabel={false}
						isRequired={true}
						nameInput="password"
						placeHolderText="Enter password"
						getFormErrorMessage={getFormErrorMessage}
						rules={{
							maxLength: {
								value: 20,
								message: "El campo supera los 20 caracteres",
							},
							required: "*El campo es requerido.",
							pattern: {
								value: /^\S/,
								message: "No debe tener espacios al inicio",
							},
						}} />
					<PasswordInput
						label=""
						width="100%"
						maxLength={20}
						control={control}
						showLabel={false}
						isRequired={true}
						className="noLabel"
						nameInput="password_confirmation"
						placeHolderText="Confirm Password"
						getFormErrorMessage={getFormErrorMessage}
						rules={{
							maxLength: {
								value: 20,
								message: "El campo supera los 20 caracteres",
							},
							required: "*El campo es requerido.",
							pattern: {
								value: /^\S/,
								message: "No debe tener espacios al inicio",
							}
						}} />
				</div>
				<div className="p-field mb-4">
					<Button className="dark-blue fullwidth" label="Sign up" type="submit" loading={sending} />
				</div>
			</div>
		</div>
	</form>
}
export default Recover