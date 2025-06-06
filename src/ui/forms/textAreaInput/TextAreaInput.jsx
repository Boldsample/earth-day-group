import { Controller } from "react-hook-form"
import { InputTextarea } from "primereact/inputtextarea"
import InfoTooltip from "@ui/tooltip/InfoTooltip";

const TextAreaInput = ({
	rules,
	control,
	rowCount = 5,
	disabled,
	nameInput,
	className,
	labelName,
	showLabel = true,
	isRequired = false,
	toolTipMessage = "",
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
				rows={rowCount}
				cols={30}
				id={field.name}
				disabled={disabled}
				placeholder={placeHolderText}
				{...field} />
			} />
		{getFormErrorMessage(nameInput)}
	</>

return (
	<div className="p-field">
	  {showLabel ? (
		<>
		  <label htmlFor={nameInput}>
			{labelName} {isRequired && <span className="text-red-600">*</span>}
			{toolTipMessage != "" && (
				<InfoTooltip toolTipMessage={toolTipMessage}/>
			)}
			{renderInput()}
		  </label>
		</>
	  ) : (
		renderInput()
	  )}
	</div>
  );
}

export default TextAreaInput