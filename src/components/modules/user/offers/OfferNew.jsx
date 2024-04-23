import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { setHeader } from '@store/slices/globalSlice'
import GoBackButton from "@ui/buttons/goBackButton/GoBackButton"
import { TextInput, NumberInput, PasswordInput, TextAreaInput, DropDownInput, CheckBoxInput, FileUploadInput, UploadPhotoInput } from "@ui/forms"

import countries from "@json/countries.json"

const OfferNew = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [sending, setSending] = useState(false)
	const user = useSelector((state) => state.users.userData);
	const [photoFileBlob, setPhotoFileBlob] = useState(user?.picture)
	const {
		reset,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: '',
			material: '',
			quantity: '',
			price: '',

		}
	})
	
	const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
	const onSubmit = async (data) => {
		console.log(data)
		navigate('offers')
	}

	useEffect(() => {
		dispatch(setHeader('user'))
	}, [])

	return <div className="layout">
		<img className="layout__background" src="/assets/user/image-2.svg" />
		<div className="main__content halfwidth">
			<form onSubmit={handleSubmit(onSubmit)}>
				<h4 className="text-defaultCase text-dark-blue"><i className="pi pi-tag" /> Post Offer</h4>
				<div className="registerInput__container-x2">
					<TextInput
						width="100%"
						isEdit={true}
						control={control}
						showLabel={false}
						isRequired={true}
						labelName="Title"
						nameInput="title"
						placeHolderText="Title*"
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
					<DropDownInput
						isEdit={true}
						control={control}
						showLabel={false}
						isRequired={true}
						nameInput="material"
						labelName="Select Material"
						placeHolderText="Select Material"
						getFormErrorMessage={getFormErrorMessage}
						options={['Paper', 'Glass', 'Plastic', 'E-Waste', 'Metal', 'Organic']} />
				</div>
				<div className="registerInput__container-x2">
					<NumberInput
						width="100%"
						label="Quantity"
						showLabel={false}
						control={control}
						isRequired={true}
						nameInput="quantity"
						placeHolderText="Quantity*"
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
						}} />
					<DropDownInput
						isEdit={true}
						control={control}
						showLabel={false}
						isRequired={true}
						nameInput="unit"
						labelName="Select Unit"
						placeHolderText="Select Unit"
						getFormErrorMessage={getFormErrorMessage}
						options={['Kg', 'cc']} />
				</div>
				<NumberInput
					width="100%"
					showLabel={false}
					control={control}
					nameInput="price"
					isRequired={true}
					label="Asking price"
					placeHolderText="Asking Price*"
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
					}} />
					<UploadPhotoInput type="imageUpload" title='Add Picture' className='imagesHub__container-variant' />
				<div className="mb-1"></div>
				{/* <div className="mt-2">
					<h5 className="text-bold">Add picture</h5>
				</div> */}
				<div className="p-field" style={{ marginBottom: "24px" }}>
					<Button className="dark-blue fullwidth" label="Post" type="submit" />
				</div>
			</form>
		</div>
		<Link to="/register/categories/"><GoBackButton /></Link>
	</div>
}

export default OfferNew