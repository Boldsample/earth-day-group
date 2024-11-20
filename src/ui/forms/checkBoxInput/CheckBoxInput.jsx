import { Controller } from "react-hook-form"
import { classNames } from "primereact/utils"
import { Checkbox } from "primereact/checkbox"
import InfoTooltip from "@ui/tooltip/InfoTooltip"

const CheckBoxInput = ({
	rules,
	control,
	nameInput,
	checkBoxText,
	toolTipMessage="",
	getFormErrorMessage
}) => {
	return <>
		<Controller
			name={nameInput}
			control={control}
			rules={rules}
			render={({ field, fieldState }) =>{
				return (
					<>
					<label className="checkbox__label" htmlFor={field.name}>
					<Checkbox
						inputRef={field.ref}
						inputId={field.name}
						checked={field.value}
						onChange={(e) => field.onChange(e.checked)}
						className={classNames({ "p-invalid": fieldState.error })} />
					{checkBoxText}
					{toolTipMessage != "" && (
						<InfoTooltip toolTipMessage={toolTipMessage}/>
					)}
				</label>
					</>
				)} 
			} />
		{getFormErrorMessage(nameInput)}
	</>
}

export default CheckBoxInput