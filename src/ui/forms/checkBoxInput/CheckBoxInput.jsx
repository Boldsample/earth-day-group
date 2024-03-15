import { Checkbox } from "primereact/checkbox";
import { Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
import "./checkBoxInput.sass";
import React from "react";

const CheckBoxInput = ({
  nameInput,
  control,
  rules,
  getFormErrorMessage,
  checkBoxText,
}) => {
  return (
    <div className="checkBox__outterContainer">
      <div className="checkBox__innerContainer">
        <Controller
          name={nameInput}
          control={control}
          rules={rules}
          render={({ field, fieldState }) => (
            <>
              <label
                htmlFor={field.name}
                //   className={classNames({ "p-error": errors.checked })}
              ></label>
              <Checkbox
                inputId={field.name}
                checked={field.value}
                inputRef={field.ref}
                className={classNames({ "p-invalid": fieldState.error })}
                onChange={(e) => field.onChange(e.checked)}
              />
              <small>{checkBoxText}</small>
            </>
          )}
        />
      </div>
      {getFormErrorMessage(nameInput)}
    </div>
  );
};

export default CheckBoxInput;
