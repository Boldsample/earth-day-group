import { RadioButton } from 'primereact/radiobutton'
import { Controller } from 'react-hook-form'

interface data {
  value: number
  name: string
}

type InputProps = {
  control: any
  label: string
  isRequerid: boolean
  nameInput: string
  isEdit?: boolean
  data?: data[]
}

function RadiobuttonHookForm({
  control,
  data = [{ value: 0, name: '' }],
  label,
  isRequerid,
  nameInput,
  isEdit,
}: InputProps) {
  return (
    <div className="field mb-5 ">
      <label htmlFor={nameInput} className="block font-semibold">
        {label}
        {isRequerid && <span className="text-red-600">*</span>}
      </label>
      {data.map(({ name, value }) => (
        <>
          <Controller
            name={nameInput}
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <RadioButton
                inputId={name}
                disabled={!isEdit}
                value={value}
                checked={field.value === value}
                onChange={(e) => {                            
                    field.onChange(e.value)}}
              />
            )}
          />
          <label htmlFor={name} className="ml-2 mr-5">
            {name}
          </label>
        </>
      ))}
    </div>
  )
}

export default RadiobuttonHookForm
