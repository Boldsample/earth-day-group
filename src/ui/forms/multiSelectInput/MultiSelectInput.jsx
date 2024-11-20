import { Controller } from "react-hook-form";
import { MultiSelect } from 'primereact/multiselect';
import InfoTooltip from "@ui/tooltip/InfoTooltip";

const MultiSelectInput = ({
  label,
  rules,
  control,
  options,
  disabled,
  nameInput,
  isRequired,
  optionLabel,
  optionValue,
  labelName = "",
  showLabel = true,
  toolTipMessage = "",
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
          <MultiSelect
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
};

export default MultiSelectInput;
