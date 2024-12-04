import React, {useState} from "react";
import { RadioButton } from "primereact/radiobutton";
import { Controller } from "react-hook-form";
import { Calendar } from 'primereact/calendar';
import './styles.sass'
import InfoTooltip from "@ui/tooltip/InfoTooltip";

function CalendarInput({
  data,
  label,
  rules,
  control,
  labelName,
  nameInput,
  isRequired,
  placeHolderText,
  disabled = false,
  showLabel = true,
  toolTipMessage="",
  getFormErrorMessage,
}) {
  // const [dates, setDates] = useState(null);
  const disableToday = value => {
    let _dates = []
    if(value.length > 0 && value[1] == null)
      _dates.push(new Date())
    return _dates
  }
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
          disabledDates={disableToday(field.value)}
          placeholder={placeHolderText}
          inputId={nameInput + "_" + name}
          // onChange={(e) => setDates(e.value)}
          onChange={e => field.onChange(e.value)}
            />
        } />
        {getFormErrorMessage(nameInput)}
      <label htmlFor={nameInput + "_" + name}>{name}</label>
    </div>

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

export default CalendarInput