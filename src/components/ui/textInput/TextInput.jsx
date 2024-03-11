import React from "react";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { Controller } from "react-hook-form";
import "./textInput.sass";

const TextInput = ({
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
}) => {
  const inputWidth = {
    width: width,
    height: height,
  };

  const renderInput = () => (
    <>
      <Controller
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
            // value={email}
          />
        )}
      />
      {getFormErrorMessage(inputName)}
    </>
  );

  return (
    <div className="p-field">
      {showLabel ? (
        <label htmlFor={inputName}>
          {inputName}
          {renderInput()}
        </label>
      ) : (
        renderInput()
      )}
    </div>
  );
};

export default TextInput;
