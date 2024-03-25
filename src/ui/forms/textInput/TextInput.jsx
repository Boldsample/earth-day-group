import React from "react";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { Controller } from "react-hook-form";
import "./textInput.sass";


const TextInput = ({
  labelname= '',
  inputName,
  placeHolderText,
  type = "text",
  tailoredClass,
  maxLength,
  width,
  height,
  color,
  showLabel,
  getFormErrorMessage,
  control,
  rules,
  isRequired,
  isEdit,
  showToolTip,
  showIcon,
  iconName
}) => {
  const inputWidth = {
    width: width,
    height: height,
  };

  
  const renderInput = () => (
    <>
    {showIcon ? (<span className="p-input-icon-left">
    <i className={iconName} />
    <Controller
        name={inputName}
        control={control}
        rules={rules}
        render={({ field }) => (
          <InputText
            maxLength={maxLength}
            style={ showIcon ? { paddingLeft: "50px"} : {} + inputWidth }
            disabled={!isEdit}
            className={"p-inputtext" + tailoredClass}
            id={field.name}
            {...field}
            placeholder={placeHolderText}
            type={type}
          />
        )}
      />
</span>) : (<Controller
        name={inputName}
        control={control}
        rules={rules}
        render={({ field }) => (
          <InputText
            maxLength={maxLength}
            style={inputWidth}
            disabled={!isEdit}
            className={"p-inputtext" + tailoredClass}
            id={field.name}
            {...field}
            placeholder={placeHolderText}
            type={type}
          />
        )}
      />)}
      {getFormErrorMessage(inputName)}
    </>
  );

  return (
    <div className="p-field">
      {showLabel ? (
        <label htmlFor={inputName}>
          {label} {isRequired && <span className="text-red-600">*</span>}
          {labelname}
          {renderInput()}
        </label>
      ) : (
        renderInput()
      )}
    </div>
  );
};

export default TextInput;
