import { Dropdown } from 'primereact/dropdown'
import { ChangeEventHandler } from 'react'
import { Controller } from 'react-hook-form'


function DropDownInput({
  showLabel,
  labelName = '',
  control,
  label,
  isRequired,
  nameInput,
  rules,
  isEdit,
  options,
  optionLabel,
  optionValue,
  getFormErrorMessage,
  className = '',
  placeHolderText = '',
  onChange,
  width,
  height
}) {

  // const inputWidth = {
  //   width: width,
  //   height: height,
  // };

  
  const renderInput = () => (
    <>
       <Controller
        name={nameInput}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Dropdown
            disabled={!isEdit}
            value={field.value}
            key={field.value}
            onChange={(e) => {
              field.onChange(e.value)
              if (onChange) {
                onChange()
              }
            }}
            options={options}
            optionLabel={optionLabel}
            optionValue={optionValue}
            placeholder={placeHolderText}
            className={'w-full md:w-14rem '  + className}
          />
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

export default DropDownInput;

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
//           <Dropdown
//             disabled={!isEdit}
//             value={field.value}
//             key={field.value}
//             onChange={(e) => {
//               field.onChange(e.value)
//               if (onChange) {
//                 onChange()
//               }
//             }}
//             options={options}
//             optionLabel={optionLabel}
//             optionValue={optionValue}
//             placeholder={placeholder}
//             className={'w-full md:w-14rem ' + className}
//           />
//         )}
//       />
//       {getFormErrorMessage(nameInput)}
//     </div>
//   )
// }
// export default DropdownHookForm
