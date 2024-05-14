import { InputSwitch } from 'primereact/inputswitch'
import { Controller } from 'react-hook-form'
import './switchInput.sass'

function SwitchInput({
  control,
  label,
  isRequired,
  nameInput,
  isEdit,
  value,
  checked,
  setChecked
}) {
  return (
    <div className="switchInput__container">
      <label>   
        {label} {isRequired && <span className="text-red-600">*</span>}
      </label>
       <InputSwitch
            checked={checked}
            disabled={!isEdit}
            onChange={(e) => setChecked(e.value)}
   
          />
    </div>
  )
}

export default SwitchInput
