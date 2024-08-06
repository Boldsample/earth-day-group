import { Controller } from "react-hook-form"
import { InputTextarea } from "primereact/inputtextarea"

const TextAreaInput = ({
	rules,
	control,
	disabled,
	nameInput,
	className,
	labelName,
	isRequired,
	showLabel = true,
	getFormErrorMessage,
	placeHolderText = "",
}) => {
	const renderInput = () => <>
		<Controller
			rules={rules}
			name={nameInput}
			control={control}
			render={({ field }) => <InputTextarea
				className={className}
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
			{labelName} {isRequired && <span className="text-red-600">*</span>}
			{renderInput()}
		</label> : renderInput()}
	</div>
}

export default TextAreaInput