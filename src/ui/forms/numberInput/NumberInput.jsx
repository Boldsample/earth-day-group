import { Controller } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";

const NumberInput = ({
  label,
  rules,
  width,
  height,
  control,
  disabled,
  inputRef,
  nameInput,
  isRequired,
  labelName = "",
  maxLength = 10,
  mode = 'decimal',
  showLabel = true,
  getFormErrorMessage,
  placeHolderText = "",
}) => {
  const inputWidth = {
    width: width,
    height: height,
  };
  const renderInput = () => (
    <>
      <Controller
        rules={rules}
        name={nameInput}
        control={control}
        render={({ field }) => <InputNumber
          mode={mode}
          locale="en-US"
          currency="USD"
          ref={inputRef}
          id={field.name}
          style={inputWidth}
          disabled={disabled}
          onBlur={field.onBlur}
          maxLength={maxLength}
          value={field.value || null}
          placeholder={placeHolderText}
          useGrouping={mode != 'decimal'}
          onValueChange={(e) => field.onChange(e)} />
        } />
      {getFormErrorMessage(nameInput)}
    </>
  );

  return <div className="p-field">
    {showLabel ? <label htmlFor={nameInput}>
      {labelName} {isRequired && <span className="text-red-600">*</span>}
      {renderInput()}
    </label> : renderInput()}
  </div>
}

export default NumberInput