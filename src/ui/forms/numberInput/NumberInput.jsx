import { InputNumber } from "primereact/inputnumber";
import { Tooltip } from "primereact/tooltip";
import { Controller } from "react-hook-form";

function NumberInput({
  labelName = "",
  control,
  label,
  isRequired,
  nameInput,
  rules,
  isEdit,
  getFormErrorMessage,
  className = "",
  placeHolderText = "",
  maxLength = 10,
  showTooltip = false,
  messageHelp = "",
  showLabel,
  width,
  height,
}) {
  const inputWidth = {
    width: width,
    height: height,
  };

  const renderInput = () => (
    <>
    <div>
      <Controller
        name={nameInput}
        control={control}
        rules={rules}
        render={({ field }) => (
          <InputNumber
            style={inputWidth}
            maxLength={maxLength}
            disabled={!isEdit}
            useGrouping={false}
            id={field.name}
            ref={field.ref}
            value={field.value}
            onBlur={field.onBlur}
            minFractionDigits={0}
            maxFractionDigits={5}
            onValueChange={(e) => field.onChange(e)}
            className={"w-full " + className}
            placeholder={placeHolderText}
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
}

export default NumberInput;

//   return (
//     <div className="field mb-5">
//       <label htmlFor={nameInput} className="block font-semibold">
//         {showTooltip && (
//           <>
//             <Tooltip target=".custom-target-icon" />
//             <i
//               className="custom-target-icon pi pi-info-circle p-text-secondary p-overlay-badge"
//               data-pr-tooltip={messageHelp}
//               data-pr-position="right"
//               data-pr-at="right+5 top"
//               data-pr-my="left center-2"
//               style={{ fontSize: '1rem', cursor: 'pointer', marginRight: "5px"}}></i>
//           </>
//         )}
//         {label} {isRequired && <span className="text-red-600">*</span>}
//       </label>
//       <Controller
//         name={nameInput}
//         control={control}
//         rules={rules}
//         render={({ field }) => (
//           <InputNumber
//             maxLength={maxLength}
//             disabled={!isEdit}
//             useGrouping={false}
//             id={field.name}
//             ref={field.ref}
//             value={field.value}
//             onBlur={field.onBlur}
//             minFractionDigits={0}
//             maxFractionDigits={5}
//             onValueChange={() => field.onChange(e)}
//             className={'w-full ' + className}
//             placeholder={placeholder}
//           />
//         )}
//       />
//       {getFormErrorMessage(nameInput)}
//     </div>
//   )
// }

// export default InputNumberHookForm
