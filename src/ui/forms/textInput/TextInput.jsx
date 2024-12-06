import { Controller } from "react-hook-form"
import { InputText } from "primereact/inputtext"
import InfoTooltip from "@ui/tooltip/InfoTooltip";


const TextInput = ({
  rules,
  width,
  height,
  control,
  showIcon,
  iconName,
  maxLength,
  nameInput,
  className,
  isRequired,
  type = "text",
  labelName = "",
  toolTipMessage = "",
  disabled = false,
  showLabel = true,
  autocomplete = "on",
  getFormErrorMessage,
  onKeyDown = () => {},
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
      render={({ field }) => 
        <InputText
          type={type}
          id={field.name}
          style={inputWidth}
          disabled={disabled}
          className={className}
          maxLength={maxLength}
          onKeyDown={onKeyDown}
          autoComplete={autocomplete}
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

export default TextInput
