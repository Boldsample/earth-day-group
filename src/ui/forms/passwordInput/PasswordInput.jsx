import { useEffect, useRef } from "react"
import { Controller } from "react-hook-form"
import { Password } from "primereact/password"

const PasswordInput = ({
  label,
  rules,
  control,
  nameInput,
  showLabel,
  isRequired,
  maxLength = 50,
  feedback = true,
  getFormErrorMessage,
  placeHolderText = "",
}) => {
  const passwordRef = useRef(null)

  const renderInput = () => <>
    <Controller
      rules={rules}
      name={nameInput}
      control={control}
      render={({ field }) => (
        <Password
          toggleMask
          id={field.name}
          feedback={feedback}
          maxLength={maxLength}
          placeholder={placeHolderText}
          {...field} />
      )} />
    {getFormErrorMessage(nameInput)}
  </>

  useEffect(() => {
    passwordRef?.current?.querySelector('.p-icon').removeAttribute('tabindex')
  }, [])

  return <div className="p-field" ref={passwordRef}>
    {showLabel ? <label htmlFor={nameInput}>
      {label} {isRequired && <span className="text-red-600">*</span>}
      {renderInput()}
    </label> : renderInput()}
  </div>
}

export default PasswordInput;
