import { RadioButton } from "primereact/radiobutton";
import { Controller } from "react-hook-form";
import './radioInput.sass'
import InfoTooltip from "@ui/tooltip/InfoTooltip";

function RadioInput({
  data,
  label,
  rules,
  control,
  labelName,
  nameInput,
  isRequired,
  toolTipMessage = "",
  disabled = false,
  showLabel = true,
  children
}) {
  const renderInput = () => <div className="radioInput__container">
    {data.map(({ name, value }, key) => <div key={key} className="inline-block">
      <Controller
        rules={rules}
        name={nameInput}
        control={control}
        render={({ field }) => <RadioButton
          value={value}
          disabled={disabled}
          checked={field.value === value}
          inputId={nameInput + "_" + name}
          onChange={e => field.onChange(e.value)} />
        } />
      <label htmlFor={nameInput + "_" + name}>{name}</label>
    </div>)}
  </div>

return (
  <div className="p-field">
    {showLabel ? (
      <>
        <label htmlFor={nameInput}>
          {labelName} {isRequired && <span className="text-red-600">*</span>}
          {children}
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

export default RadioInput