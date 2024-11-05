import React, {useState} from "react";
import { RadioButton } from "primereact/radiobutton";
import { Controller } from "react-hook-form";
import { Calendar } from 'primereact/calendar';
import './styles.sass'

function CalendarInput({
  data,
  label,
  rules,
  control,
  labelName,
  nameInput,
  isRequired,
  disabled = false,
  showLabel = true,
  getFormErrorMessage,
  placeHolderText
}) {
  // const [dates, setDates] = useState(null);
  const renderInput = () => <div>
      <Controller
        rules={rules}
        name={nameInput}
        control={control}
        render={({ field }) => 
        <Calendar
		      readOnlyInput 
          value={field.value}
          disabled={disabled}
          hideOnRangeSelection
          minDate={new Date()}
          selectionMode="range"
          placeholder={placeHolderText}
          inputId={nameInput + "_" + name}
          // onChange={(e) => setDates(e.value)}
          onChange={e => field.onChange(e.value)}
            />
        } />
        {getFormErrorMessage(nameInput)}
      <label htmlFor={nameInput + "_" + name}>{name}</label>
    </div>

  return <div className="p-field">
    {showLabel && <label htmlFor={nameInput}>
      {labelName} {isRequired && <span className="text-red-600">*</span>}
      {renderInput()}
    </label> || renderInput()}
  </div>
}

export default CalendarInput