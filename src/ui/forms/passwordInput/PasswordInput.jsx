import { useEffect, useRef } from "react"
import { Controller } from "react-hook-form"
import { Password } from "primereact/password"
import { useTranslation } from "react-i18next"
const PasswordInput = ({
  passwordRequirementsPopUp,
  rules,
  control,
  nameInput,
  labelName,
  isRequired,
  maxLength = 50,
  feedback = true,
  showLabel = true,
  getFormErrorMessage,
  placeHolderText = "",
}) => {
  const passwordRef = useRef(null)
  const [tGlobal2] = useTranslation('translation', {keyPrefix: 'global'})
  const headerTitle = <div className="font-bold mb-3">{tGlobal2('passwordRequirementTitle2')}</div>;
  

  const renderInput = () => <>
    <Controller
      rules={rules}
      name={nameInput}
      control={control}
      render={({ field }) => (
        <Password
          header={headerTitle}
          footer={passwordRequirementsPopUp}
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
      {labelName} {isRequired && <span className="text-red-600">*</span>}
      {renderInput()}
    </label> : renderInput()}
  </div>
}

export default PasswordInput;
