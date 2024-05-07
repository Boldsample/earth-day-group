import { Controller } from "react-hook-form"
import { InputText } from "primereact/inputtext"

const TextInput = ({
	className,
	label,
	rules,
	width,
	height,
	control,
	showIcon,
	iconName,
	maxLength,
	nameInput,
	showLabel,
	isRequired,
	type = "text",
	autocomplete = "on",
	getFormErrorMessage,
	placeHolderText = "",
}) => {
	const inputWidth = {
		width: width,
		height: height,
	};
	const renderInput = () => <>
		{showIcon ? <span className="p-input-icon-left">
			<i className={iconName} />
		</span> : null}
		<Controller
			rules={rules}
			name={nameInput}
			control={control}
			render={({ field }) => <InputText
				className={className}
				type={type}
				id={field.name}
				style={inputWidth}
				maxLength={maxLength}
				autoComplete={autocomplete}
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

export default TextInput