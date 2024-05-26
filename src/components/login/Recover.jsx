import { useDispatch } from "react-redux"
import { Button } from "primereact/button"
import { useState, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router-dom"

import { PasswordInput } from "@ui/forms"
import { recoverUser } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"

const Recover = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
	let [searchParams, setSearchParams] = useSearchParams()
	const {
		control,
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
		if(await recoverUser(data, {email: searchParams.get('token')}))
			navigate('/login/')
    setSending(false)
	}
	const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>

	useEffect(() => {
		dispatch(setHeader('register'))
	}, [])

	return <form onSubmit={handleSubmit(onSubmit)}>
		<div className="layout">
			<img className="layout__background" src="/assets/login/image-1.svg" />
			<div className="main__content login-form">
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
				<div className="p-field" style={{ marginBottom: "24px" }}>
					<Button className="dark-blue fullwidth" label="Sign up" type="submit" loading={sending} />
				</div>
			</div>
		</div>
	</form>
}
export default Recover