import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { InputNumber } from "primereact/inputnumber"
import InfoTooltip from "@ui/tooltip/InfoTooltip"

const NumberInput = ({
  rules,
  control,
  disabled,
  inputRef,
  nameInput,
  isRequired,
  labelName = "",
  maxLength = 10,
  mode = 'decimal',
  showLabel = true,
  useGrouping = true,
  toolTipMessage = "",
  getFormErrorMessage,
  placeHolderText = "",
  maxFractionDigits = 2,
}) => {
	const { i18n } = useTranslation('translation')
  const renderInput = () => (
    <>
      <Controller
        rules={rules}
        name={nameInput}
        control={control}
        render={({ field }) => <InputNumber
          mode={mode}
          ref={inputRef}
          id={field.name}
          disabled={disabled}
          onBlur={field.onBlur}
          maxLength={maxLength}
          useGrouping={useGrouping}
          value={field.value || null}
          placeholder={placeHolderText}
          maxFractionDigits={maxFractionDigits}
          onValueChange={(e) => field.onChange(e)}
          currency={i18n.language == 'es' ? 'COP' : 'USD'}
          locale={i18n.language == 'es' ? 'es-CO' : 'en-US'} />
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

export default NumberInput