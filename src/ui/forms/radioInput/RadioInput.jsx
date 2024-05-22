import { RadioButton } from "primereact/radiobutton";
import { Controller } from "react-hook-form";
import { useState } from "react";
import './radioInput.sass'

function RadioInput({
  labelName,
  showLabel,
  control,
  data,
  label,
  isRequired,
  nameInput,
  isEdit,
}) {
  const [checked, setChecked] = useState(false)
  // Los datos deben ser pasados asi desde el componente padre por medio de props.
  // const data = [
  //   { name: "Con autenticación", value: 1 },
  //   { name: "Sin autenticación", value: 2 },
  // ];
console.log(checked)
  const renderInput = () => (
    <>
    <div className="radioInput__container">
      {data.map(({ name, value }) => (
        <>
          <Controller
            name={nameInput}
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <RadioButton
                // unstyled={true}
                inputId={name}
                disabled={!isEdit}
                value={value}
                checked={field.value === value}
                onChange={(e) => {
                  setChecked(e.checked)
                  field.onChange(e.value);
                }}
              />
            )}
          />
          <label htmlFor={name} className={checked == true ? 'highlighted' : ''}>
            {name}
          </label>
        </>
      ))}
    </div>
    </>
  );

  return (
    <div className="p-field">
      {showLabel ? (
        <>
        <label htmlFor={nameInput}>
          {label} {isRequired && <span className="text-red-600">*</span>}
          {labelName}
        </label>
          {renderInput()}
        </>
      ) : (
        renderInput()
      )}
    </div>
  );
}

export default RadioInput;

// {
//   return (
//     <div className="field mb-5 ">
//       <label htmlFor={nameInput} className="block font-semibold">
//         {label}
//         {isRequerid && <span className="text-red-600">*</span>}
//       </label>
//       {data.map(({ name, value }) => (
//         <>
//           <Controller
//             name={nameInput}
//             control={control}
//             rules={{
//               required: true,
//             }}
//             render={({ field }) => (
//               <RadioButton
//                 inputId={name}
//                 disabled={!isEdit}
//                 value={value}
//                 checked={field.value === value}
//                 onChange={(e) => {
//                     field.onChange(e.value)}}
//               />
//             )}
//           />
//           <label htmlFor={name} className="ml-2 mr-5">
//             {name}
//           </label>
//         </>
//       ))}
//     </div>
//   )
// }

// export default RadiobuttonHookForm
