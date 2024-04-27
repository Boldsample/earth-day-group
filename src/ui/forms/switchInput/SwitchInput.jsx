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
      {/* <Controller
        name={nameInput}
        control={control}
        rules={{
          required: isRequired,
        }}
        render={({ field }) => (
          <InputSwitch
            checked={field.value === value}
            disabled={!isEdit}
            onChange={(e) => {
              // console.log(e.value)
              if (e.value === true && value === 1) {
                field.onChange(1)
              } else if (e.value === false && value === 1) {
                field.onChange(0)
              } else {
                field.onChange(e.value)
              }
            }}
          />
        )}
      /> */}
       <InputSwitch
            checked={checked}
            disabled={!isEdit}
            // console.log(e.value)
            onChange={(e) => setChecked(e.value)}
   
          />
    </div>
  )
}

export default SwitchInput
