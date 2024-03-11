import { InputTextarea } from 'primereact/inputtextarea'
import { Controller } from 'react-hook-form'


const TextAreaInput = ({
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
  }) =>{

const renderInput = () => (
  <>
      <Controller
         name={nameInput}
         control={control}
          rules={rules}
          render={({ field }) => (
          <InputTextarea id={field.name} disabled={!isEdit} {...field} placeholder={placeHolderText} className={'w-full '+ className} rows={5} cols={30}  />
       )}
       />
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

export default TextAreaInput;


// {
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
//           <InputTextarea id={field.name} disabled={!isEdit} {...field} placeholder={placeholder} className={'w-full '+ className} rows={5} cols={30}  />
//         )}
//       />
//       {getFormErrorMessage(nameInput)}
//     </div>
//   )
// }
// export default TextAreaHookForm
