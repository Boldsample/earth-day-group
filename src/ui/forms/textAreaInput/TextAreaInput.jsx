import { Controller } from "react-hook-form"
import { InputTextarea } from "primereact/inputtextarea"

const TextAreaInput = ({
	label,
	rules,
	control,
	disabled,
	nameInput,
	showLabel,
	isRequired,
	getFormErrorMessage,
	placeHolderText = "",
}) => {
	const renderInput = () => <>
		<Controller
			rules={rules}
			name={nameInput}
			control={control}
			render={({ field }) => <InputTextarea
				rows={5}
				cols={30}
				id={field.name}
				disabled={disabled}
				placeholder={placeHolderText}
				{...field} />
			} />
		{getFormErrorMessage(nameInput)}
	</>

	return <div className="p-field">
		{showLabel ? <label htmlFor={nameInput}>
			{label} {isRequired && <span className="text-red-600">*</span>}
			{renderInput()}
		</label> : renderInput()}
	</div>
}

export default TextAreaInput