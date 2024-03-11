import { InputTextarea } from 'primereact/inputtextarea'
import { Controller } from 'react-hook-form'

type InputProps = {
  control: any
  label: string
  isRequerid: boolean
  nameInput: string
  getFormErrorMessage: Function
  rules?: any
  isEdit?: boolean
  className?: string
  placeholder?: string
}

function TextAreaHookForm({
  control,
  label,
  isRequerid,
  nameInput,
  rules,
  isEdit,
  getFormErrorMessage,
  className = '',
  placeholder = '',
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
          <InputTextarea id={field.name} disabled={!isEdit} {...field} placeholder={placeholder} className={'w-full '+ className} rows={5} cols={30}  />
        )}
      />
      {getFormErrorMessage(nameInput)}
    </div>
  )
}
export default TextAreaHookForm
