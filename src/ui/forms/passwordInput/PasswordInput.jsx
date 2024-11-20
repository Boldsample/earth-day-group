import { useEffect, useRef } from "react"
import { Controller } from "react-hook-form"
import { Password } from "primereact/password"
import { useTranslation } from "react-i18next"
import InfoTooltip from "@ui/tooltip/InfoTooltip"

const PasswordInput = ({
  rules,
  control,
  nameInput,
  labelName,
  isRequired,
  maxLength = 50,
  feedback = true,
  showLabel = true,
  toolTipMessage = "",
  placeHolderText = "",
  getFormErrorMessage,
  passwordRequirementsPopUp,
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
		      toggleMask
          id={field.name}
          feedback={feedback}
          header={headerTitle}
          maxLength={maxLength}
          placeholder={placeHolderText}
          footer={passwordRequirementsPopUp}
          strongRegex={/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/}
          {...field} />
      )} />
    {getFormErrorMessage(nameInput)}
  </>

  useEffect(() => {
    passwordRef?.current?.querySelector('.p-icon').removeAttribute('tabindex')
  }, [])

  return (
    <div className="p-field">
      {showLabel ? (
      <>
        <label htmlFor={nameInput}>
        {labelName} {isRequired && <span className="text-red-600">*</span>}
        {toolTipMessage != "" && (
          <InfoTooltip toolTipMessage={toolTipMessage}/>
        )}
        {renderInput()}
        </label>
      </>
      ) : (
      renderInput()
      )}
    </div>
    );
}

export default PasswordInput;
