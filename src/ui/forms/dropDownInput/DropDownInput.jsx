import { Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";

const DropDownInput = ({
  label,
  rules,
  control,
  options,
  disabled,
  nameInput,
  showLabel,
  isRequired,
  optionLabel,
  optionValue,
  getFormErrorMessage,
  placeHolderText = "",
}) => {
  const renderInput = () => (
    <>
      <Controller
        rules={rules}
        name={nameInput}
        control={control}
        render={({ field }) => (
          <Dropdown
            id={field.name}
            options={options}
            disabled={disabled}
            optionLabel={optionLabel}
            optionValue={optionValue}
            filter
            placeholder={placeHolderText}
            {...field}
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

export default DropDownInput;
