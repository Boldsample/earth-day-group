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

// type InputProps = {
//   control: any
//   label: string
//   isRequerid: boolean
//   nameInput: string
//   getFormErrorMessage: Function
//   rules?: any
//   isEdit?: boolean
//   className?: string
//   placeholder?: string
//   maxLength?: number
//   showTooltip?: boolean
//   messageHelp?: string
//   type?: string
// }

// function InputTextHookForm({
//   control,
//   label,
//   isRequerid,
//   nameInput,
//   rules,
//   isEdit,
//   getFormErrorMessage,
//   className,
//   placeholder = '',
//   maxLength = 50,
//   showTooltip = false,
//   messageHelp = '',
//   type = 'text',
// }) {
//   const handleKeyPress = () => {
//     if (event.key === 'Enter') {
//       event.preventDefault()
//     }
//   }

//   return (
//     <div className="field mb-5">
//       <label htmlFor={nameInput} className="block font-semibold">
//       {showTooltip && (
//           <>
//             <Tooltip target=".custom-target-icon" />
//             <i
//               className="custom-target-icon pi pi-info-circle p-text-secondary p-overlay-badge"
//               data-pr-tooltip={messageHelp}
//               data-pr-position="right"
//               data-pr-at="right+5 top"
//               data-pr-my="left center-2"
//               style={{ fontSize: '1rem', cursor: 'pointer', marginRight: "5px"}}></i>
//           </>
//         )} {label} {isRequerid && <span className="text-red-600">*</span>}
//       </label>
//       <Controller
//         name={nameInput}
//         control={control}
//         rules={rules}
//         render={({ field }) => (
//           <InputText
//             type={type}
//             maxLength={maxLength}
//             disabled={!isEdit}
//             id={field.name}
//             placeholder={placeholder}
//             {...field}
//             className={'w-full ' + className}
//             onKeyPress={handleKeyPress}
//           />
//         )}
//       />
//       {getFormErrorMessage(nameInput)}
//     </div>
//   )
// }
// export default InputTextHookForm
