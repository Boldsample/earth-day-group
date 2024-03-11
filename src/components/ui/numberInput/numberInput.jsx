import { InputNumber } from 'primereact/inputnumber'
import { Tooltip } from 'primereact/tooltip'
import { Controller } from 'react-hook-form'

type InputProps = {
  control: any
  label: string
  isRequired: boolean
  nameInput: string
  getFormErrorMessage: Function
  rules?: Object
  isEdit?: boolean
  className?: string
  placeholder?: string
  maxLength?: number
  showTooltip?: boolean
  messageHelp?: string
}

function InputNumberHookForm({
  control,
  label,
  isRequired,
  nameInput,
  rules,
  isEdit,
  getFormErrorMessage,
  className = '',
  placeholder = '',
  maxLength = 30,
  showTooltip = false,
  messageHelp = ''
}: InputProps) {
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  return (
    <div className="field mb-5">
      <label htmlFor={nameInput} className="block font-semibold">
        {showTooltip && (
          <>
            <Tooltip target=".custom-target-icon" />
            <i
              className="custom-target-icon pi pi-info-circle p-text-secondary p-overlay-badge"
              data-pr-tooltip={messageHelp}
              data-pr-position="right"
              data-pr-at="right+5 top"
              data-pr-my="left center-2"
              style={{ fontSize: '1rem', cursor: 'pointer', marginRight: "5px"}}></i>
          </>
        )}
        {label} {isRequired && <span className="text-red-600">*</span>}
      </label>
      <Controller
        name={nameInput}
        control={control}
        rules={rules}
        render={({ field }) => (
          <InputNumber
            maxLength={maxLength}
            disabled={!isEdit}
            useGrouping={false}
            id={field.name}
            ref={field.ref}
            value={field.value}
            onBlur={field.onBlur}
            minFractionDigits={0}
            maxFractionDigits={5}
            onValueChange={(e: any) => field.onChange(e)}
            className={'w-full ' + className}
            placeholder={placeholder}
            onKeyPress={handleKeyPress}
          />
        )}
      />
      {getFormErrorMessage(nameInput)}
    </div>
  )
}

export default InputNumberHookForm
