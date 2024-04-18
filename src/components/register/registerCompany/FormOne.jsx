import React from "react"
import {
	TextInput,
	NumberInput,
	PasswordInput,
	TextAreaInput,
	DropDownInput,
	CheckBoxInput,
	FileUploadInput,
	UploadPhotoInput,
} from "@ui/forms";
import countries from "@json/countries.json";
const FormOne = ({
	watch,
	control,
	setError,
	setValue,
	getValues,
	getFormErrorMessage,
}) => {
	return (
		<>
		<UploadPhotoInput
			watch={watch}
			control={control}
			setError={setError}
			setValue={setValue}
			getValues={getValues}
			type="profilePhotoUpload" />
		<div className="registerInput__container-x2">
			<TextInput
			isRequired={true}
			labelName="Company Name"
			isEdit={true}
			getFormErrorMessage={getFormErrorMessage}
			control={control}
			nameInput="companyName"
			placeHolderText="Company Name*"
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
			labelName="NIT"
			isEdit={true}
			getFormErrorMessage={getFormErrorMessage}
			control={control}
			nameInput="nit"
			placeHolderText="NIT*"
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
			labelName="Website"
			isEdit={true}
			getFormErrorMessage={getFormErrorMessage}
			control={control}
			nameInput="website"
			placeHolderText="Website"
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
		</div>
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
		<TextAreaInput
			label="Description"
			nameInput="description"
			showLabel={true}
			control={control}
			isRequired={false}
			placeHolderText="Tell us about your company"
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
			}}
			/>
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
				},
			}}
			/>
		</div>
		<div className="p-field" style={{ marginBottom: "24px" }}>
			<CheckBoxInput
			nameInput="termsConditionsChecked"
			control={control}
			rules={{ required: "Accept is required." }}
			getFormErrorMessage={getFormErrorMessage}
			checkBoxText="I've read and accept the terms & conditions."
			/>
		</div>
		</>
	)
}

export default FormOne;