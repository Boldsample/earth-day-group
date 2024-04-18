import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { createUser } from "@services/userServices"
import { setHeader } from "@store/slices/globalSlice"
import { getUserData } from "@store/slices/usersSlice"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"
import { updateThankyou } from "@store/slices/globalSlice"
import GoBackButton from "@ui/buttons/goBackButton/GoBackButton"
import { TextInput, NumberInput, PasswordInput, TextAreaInput, DropDownInput, CheckBoxInput, FileUploadInput } from "@ui/forms"

import countries from "@json/countries.json"
import "./style.sass"

const RegisterUser = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [sending, setSending] = useState(false)
	const user = useSelector((state) => state.users.userData);
	const [photoFileBlob, setPhotoFileBlob] = useState(user?.picture)
	const {
		reset,
		watch,
		control,
		setValue,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			bio: "",
			phone: null,
			location: "",
			password: "",
			username: "",
			accept_terms: false,
			name: user?.name || "",
			email: user?.email || "",
			password_confirmation: "",
			picture: user?.picture || "",
		}
	})
	
	const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
	const onSubmit = async (data) => {
		if(await createUser({...user, ...data})){
			dispatch(getUserData())
			dispatch(updateThankyou({
				title: "Congrats!", 
				link: "/dashboard/",
				background: "image-1.svg",
				button_label: "Go to dashboard",
				content: "You’re all signed up! We send you a verification link send your provide email. Please verify your identity.",
			}))
		}
	}

	useEffect(() => {
		dispatch(setHeader('login'))
	}, [])

	// const uploadInvoice = async (invoiceFile) => {
	//   let formData = new FormData();
	//   formData.append('invoiceFile', invoiceFile);

	//   const response = await fetch(`orders/${orderId}/uploadInvoiceFile`,
	//     {
	//       method: 'POST',
	//       body: formData
	//     },
	//   );
	// };

	// const invoiceUploadHandler = ( event ) => {

	//   const fileReader = new FileReader();
	//   fileReader.onload = (e) => {
	//     uploadInvoice(e.target.result);
	//   };
	//   fileReader.readAsDataURL(file);
	// };

	console.log(getValues());

	return <div className="layout">
		<img className="layout__background" src="/assets/register/image-2.svg" />
		<div className="main__content halfwidth">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="profile__container">
					<div className="profilePicture__container">
						<ProfilePhoto userPhoto={getValues('picture')} />
					</div>
					<div className="profileUpload__container">
						<h5 className="profileUpload__title text-defaultCase">Profile Picture</h5>
						<FileUploadInput
							watch={watch}
							control={control}
							nameInput="picture"
							setValue={setValue}
						/>
					</div>
				</div>
				<div className="registerInput__container-x2">
					<TextInput
						isRequired={true}
						labelName="Name"
						isEdit={true}
						getFormErrorMessage={getFormErrorMessage}
						control={control}
						nameInput="name"
						placeHolderText="Complete Name*"
						width="100%"
						showLabel={false}
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
						}}
					/>
					<TextInput
					isRequired={true}
					labelName="E-mail"
					isEdit={true}
					getFormErrorMessage={getFormErrorMessage}
					control={control}
					nameInput="email"
					placeHolderText="E-mail*"
					width="100%"
					showLabel={false}
					rules={{
						maxLength: {
						value: 60,
						message: "El campo supera los 60 caracteres",
						},
						required: "*El campo es requerido.",
						pattern: {
						value: /^\S/,
						message: "No debe tener espacios al inicio",
						},
					}}
					/>
				</div>
				<div className="registerInput__container-x2">
					<TextInput
					isRequired={true}
					labelName="Username"
					isEdit={true}
					getFormErrorMessage={getFormErrorMessage}
					control={control}
					nameInput="username"
					placeHolderText="Username*"
					width="100%"
					showLabel={false}
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
					}}
					/>
					<DropDownInput
						control={control}
						showLabel={false}
						labelName="Location"
						nameInput="location"
						isEdit={true}
						isRequired={true}
						// value={selectedCity} onChange={(e) => setSelectedCity(e.value)}
						options={countries}
						optionLabel="name"
						optionValue="code"
						placeHolderText="Select a Country"
						className=""
						getFormErrorMessage={getFormErrorMessage}
					/>
				</div>
				<TextAreaInput
					label="Bio"
					nameInput="bio"
					showLabel={true}
					control={control}
					isRequired={false}
					placeHolderText="Tell us about yourself"
					getFormErrorMessage={getFormErrorMessage}
					rules={{
						maxLength: {
							value: 50,
							message: "El campo supera los 50 caracteres",
						},
						required: "*El campo es requerido.",
						pattern: {
							value: /^\S/,
							message: "No debe tener espacios al inicio",
						},
					}} />
				<NumberInput
					width="100%"
					showLabel={true}
					isRequired={true}
					control={control}
					label="Phone Number"
					nameInput="phone"
					placeHolderText="Phone Number*"
					getFormErrorMessage={getFormErrorMessage}
					rules={{
						maxLength: {
							value: 7,
							message: "El campo supera los 7 caracteres",
						},
						required: "*El campo es requerido.",
						pattern: {
							value: /^\S/,
							message: "No debe tener espacios al inicio",
						},
					}}
				/>
				<div className="registerInput__container-x2">
					<PasswordInput
						width="100%"
						maxLength={20}
						label="Password"
						showLabel={true}
						control={control}
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
						showLabel={true}
						control={control}
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
					<CheckBoxInput
						control={control}
						nameInput="accept_terms"
						rules={{ required: "Accept is required." }}
						getFormErrorMessage={getFormErrorMessage}
						checkBoxText="I've read and accept the terms & conditions."
					/>
				</div>
				<div className="p-field" style={{ marginBottom: "24px" }}>
					<Button className="dark-blue fullwidth" label="Sign up" type="submit" />
				</div>
			</form>
		</div>
		<Link to="/register/categories/"><GoBackButton /></Link>
	</div>
}

export default RegisterUser