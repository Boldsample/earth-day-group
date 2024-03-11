import { Dropdown } from 'primereact/dropdown'
import { ChangeEventHandler } from 'react'
import { Controller } from 'react-hook-form'

type InputProps = {
  control: any
  label: string
  isRequerid: boolean
  nameInput: string
  getFormErrorMessage: Function
  options: any
  optionLabel: string
  optionValue: string
  rules?: any
  isEdit?: boolean
  className?: string
  placeholder?: string
  onChange?: () => void
}

function DropdownHookForm({
  control,
  label,
  isRequerid,
  nameInput,
  rules,
  isEdit,
  options,
  optionLabel,
  optionValue,
  getFormErrorMessage,
  className = '',
  placeholder = '',
  onChange,
}: InputProps) {
  return (
    <div className="field mb-5">
      <label htmlFor={nameInput} className="block font-semibold">
        {label} {isRequerid && <span className="text-red-600">*</span>}
      </label>
      <Controller
        name={nameInput}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Dropdown
            disabled={!isEdit}
            value={field.value}
            key={field.value}
            onChange={(e) => {
              field.onChange(e.value)
              if (onChange) {
                onChange()
              }
            }}
            options={options}
            optionLabel={optionLabel}
            optionValue={optionValue}
            placeholder={placeholder}
            className={'w-full md:w-14rem ' + className}
          />
        )}
      />
      {getFormErrorMessage(nameInput)}
    </div>
  )
}
export default DropdownHookForm
