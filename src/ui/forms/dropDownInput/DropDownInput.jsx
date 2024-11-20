import { Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import InfoTooltip from "@ui/tooltip/InfoTooltip";

const DropDownInput = ({
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
  toolTipMessage = "",
  optionGroupLabel,
  showLabel = true,
  optionGroupChildren,
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
            optionGroupLabel={optionGroupLabel}
            optionGroupChildren={optionGroupChildren}
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

export default DropDownInput;
