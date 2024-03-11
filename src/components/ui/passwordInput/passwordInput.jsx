import { Password } from 'primereact/password'
import { Controller } from 'react-hook-form'

type InputProps = {
  control: any
  label: string
  isRequerid: boolean
  nameInput: string
  getFormErrorMessage: Function
  rules?: Object
  isEdit?: boolean
  className?: string
  placeholder?: string
  maxLength?: number
}

function InputPasswordHookForm({
  control,
  label,
  isRequerid,
  nameInput,
  rules,
  isEdit,
  getFormErrorMessage,
  className = '',
  placeholder = '',
  maxLength = 50,
}: InputProps) {
  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }
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
          <Password
            maxLength={maxLength}
            disabled={!isEdit}
            id={field.name}
            placeholder={placeholder}
            className={'w-full ' + className}
            value={field.value}
            onChange={(e) => field.onChange(e)}
            onKeyPress={handleKeyPress}
          />
        )}
      />
      {getFormErrorMessage(nameInput)}
    </div>
  )
}
export default InputPasswordHookForm
