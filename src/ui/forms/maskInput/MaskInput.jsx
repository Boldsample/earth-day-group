import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { InputMask } from "primereact/inputmask"
import InfoTooltip from "@ui/tooltip/InfoTooltip"

const MaskInput = ({
  rules,
  control,
  disabled,
  inputRef,
  nameInput,
  isRequired,
  labelName = "",
  showLabel = true,
  toolTipMessage = "",
  getFormErrorMessage,
  placeHolderText = "123 456 7890",
}) => {
	const { i18n } = useTranslation('translation')
  const renderInput = () => (
    <>
      <Controller
        //rules={rules}
        name={nameInput}
        control={control}
        render={({ field }) => <InputMask
          ref={inputRef}
          id={field.name}
          disabled={disabled}
          mask="(999) 999-99-99"
          value={field.value || null}
          placeholder={placeHolderText}
          onChange={(e) => field.onChange(e.target.value)} />
        } />
      {getFormErrorMessage(nameInput)}
    </>
  );

 
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

export default MaskInput