import { Password } from 'primereact/password'
import { Controller } from 'react-hook-form'

function PasswordInput({
  showLabel,
  labelName,
  control,
  label,
  isRequired,
  nameInput,
  rules,
  isEdit,
  getFormErrorMessage,
  className = '',
  placeHolderText = '',
  maxLength = 50,
}) {

  // const inputWidth = {
  //   width: width,
  //   height: height,
  // };

  const errorStyling = {
    'display': 'flex;',
    'flex-direction': 'column;',
    'align-self': 'end;'
  }

  const renderInput = () => (
    <>
    <div>
       <Controller
        name={nameInput}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Password
            maxLength={maxLength}
            disabled={!isEdit}
            id={field.name}
            placeholder={placeHolderText}
            className={'w-full ' + className}
            value={field.value}
            onChange={(e) => field.onChange(e)}
          />
        )}
      />
    </div>
      {getFormErrorMessage(nameInput)}
    </>
  );

  return (
    <div className="p-field">
      {showLabel ? (
        <label htmlFor={nameInput}>
          {label} {isRequired && <span className="text-red-600">*</span>}
          {labelName}
          {renderInput()}
        </label>
      ) : (
        renderInput()
      )}
    </div>
  );
};

export default PasswordInput;

//   return (
//     <div className="field mb-5">
//       <label htmlFor={nameInput} className="block font-semibold">
//         {label} {isRequerid && <span className="text-red-600">*</span>}
//       </label>
//       <Controller
//         name={nameInput}
//         control={control}
//         rules={rules}
//         render={({ field }) => (
//           <Password
//             maxLength={maxLength}
//             disabled={!isEdit}
//             id={field.name}
//             placeholder={placeholder}
//             className={'w-full ' + className}
//             value={field.value}
//             onChange={(e) => field.onChange(e)}
//             onKeyPress={handleKeyPress}
//           />
//         )}
//       />
//       {getFormErrorMessage(nameInput)}
//     </div>
//   )
// }
// export default InputPasswordHookForm
