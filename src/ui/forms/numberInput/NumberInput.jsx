import { Controller } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";

const NumberInput = ({
  label,
  rules,
  width,
  height,
  control,
  disabled,
  nameInput,
  showLabel,
  isRequired,
  maxLength = 10,
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
        render={({ field }) => (
          <InputNumber
            id={field.name}
            ref={field.ref}
            style={inputWidth}
            disabled={disabled}
            useGrouping={false}
            value={field.value}
            onBlur={field.onBlur}
            maxLength={maxLength}
            minFractionDigits={0}
            maxFractionDigits={5}
            placeholder={placeHolderText}
            onValueChange={(e) => field.onChange(e)}
          />
        )}
      />
      {getFormErrorMessage(nameInput)}
    </>
  );

  return (
    <div className="p-field">
      {showLabel ? (
        <label htmlFor={nameInput}>
          {label} {isRequired && <span className="text-red-600">*</span>}
          {renderInput()}
        </label>
      ) : (
        renderInput()
      )}
    </div>
  );
};

export default NumberInput;
