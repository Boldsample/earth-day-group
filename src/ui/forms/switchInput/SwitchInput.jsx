import { InputSwitch } from 'primereact/inputswitch'
import { Tooltip } from 'primereact/tooltip'
import { Controller } from 'react-hook-form'

type InputProps = {
  control: any
  label: string
  isRequerid: boolean
  nameInput: string
  isEdit?: boolean
  value?: any
  showTooltip?: boolean
  messageHelp?: string
}

function InputSwitchHookForm({
  control,
  label,
  isRequerid,
  nameInput,
  isEdit,
  value,
  showTooltip = false,
  messageHelp = '',
}: InputProps) {
  return (
    <div className="field mb-5">
      <label className="block font-semibold mb-3">
        {showTooltip && (
          <>
            <Tooltip target=".custom-target-icon" />
            <i
              className="custom-target-icon pi pi-info-circle p-text-dark-blue p-overlay-badge"
              data-pr-tooltip={messageHelp}
              data-pr-position="right"
              data-pr-at="right+5 top"
              data-pr-my="left center-2"
              style={{ fontSize: '1rem', cursor: 'pointer', marginRight: '5px' }}></i>
          </>
        )}{' '}
        {label} {isRequerid && <span className="text-red-600">*</span>}
      </label>
      <Controller
        name={nameInput}
        control={control}
        render={({ field }) => (
          <InputSwitch
            checked={field.value === value}
            disabled={!isEdit}
            onChange={(e: any) => {
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
      />
    </div>
  )
}

export default InputSwitchHookForm
