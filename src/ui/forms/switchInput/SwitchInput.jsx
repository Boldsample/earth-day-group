import { InputSwitch } from 'primereact/inputswitch'
import { Controller } from 'react-hook-form'
import './switchInput.sass'

function SwitchInput({
  label,
  rules,
  control,
  nameInput,
  isRequired,
  disabled = false
}) {
  return <div className="switchInput__container">
    <label>
      {label} {isRequired && <span className="text-red-600">*</span>}
    </label>

    <Controller
      rules={rules}
      name={nameInput}
      control={control}
      render={({ field }) => <InputSwitch
        id={field.name}
        disabled={disabled}
        checked={field.value}
        onChange={e => field.onChange(e.value)} />
      } />
  </div>
}

export default SwitchInput