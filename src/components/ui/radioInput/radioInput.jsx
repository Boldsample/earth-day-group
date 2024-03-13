import { RadioButton } from "primereact/radiobutton";
import { Controller } from "react-hook-form";

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
  const renderInput = () => (
    <>
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
                inputId={name}
                disabled={!isEdit}
                value={value}
                checked={field.value === value}
                onChange={(e) => {
                  field.onChange(e.value);
                }}
              />
            )}
          />
          <label htmlFor={name} className="ml-2 mr-5">
            {name}
          </label>
        </>
      ))}
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
