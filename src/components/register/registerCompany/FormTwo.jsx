import React from "react";
import {
  NumberInput,
  TextAreaInput,
  DropDownInput,
  CheckBoxInput,
  UploadPhotoInput,
} from "@ui/forms";
import materials from "@json/recyclableMaterials.json";
import { Button } from "primereact/button";
import RecycleMaterialCard from "../../../ui/cards/recycleMaterialCard/RecycleMaterialCard";

const FormTwo = ({
  control,
  setError,
  setValue,
  getValues,
  clearErrors,
  getFormErrorMessage,
  recyclableMaterials,
  setRecyclableMaterials,
}) => {
  const units = [
    { unit: "Kilo", code: "Kg" },
    { unit: "Pound", code: "Lb" },
  ];

  const handleMaterials = () => {
	clearErrors(['unitPrice']);
    const _recyclableMaterials = [...recyclableMaterials];
    const inputValue = getValues(["materials", "unit", "unitPrice"]);
	if(!inputValue[0] || !inputValue[1] || !inputValue[2]){
		setError('unitPrice', { type: 'manual', message: 'Should select a Material, a Unit and fill a price.' })
		return false
	}
    const selectedMaterial = {
      type: inputValue[0],
      unit: inputValue[1],
      price: inputValue[2],
      color: inputValue[0].toLowerCase() + "Category",
    };
    const duplicateIndex = _recyclableMaterials.findIndex((material) => {
      return material.type == inputValue[0];
    });
    if (duplicateIndex != -1) {
      _recyclableMaterials[duplicateIndex].unit = inputValue[1];
      _recyclableMaterials[duplicateIndex].price = inputValue[2];
      setRecyclableMaterials([..._recyclableMaterials]);
    } else {
      setRecyclableMaterials([...recyclableMaterials, selectedMaterial]);
    }
    setValue("materials", "");
    setValue("unit", "");
    setValue("unitPrice", "");
  };
  return (
    <>
      <h5>Please add a complete detailed list of recyclable material</h5>
      <h4>Recyclable Material</h4>
      <div className="registerInput__container-x2">
        <DropDownInput
          control={control}
          showLabel={false}
          labelName="Material"
          nameInput="materials"
          isEdit={true}
          isRequired={true}
          // value={selectedCity} onChange={(e) => setSelectedCity(e.value)}
          options={materials}
          optionLabel="material"
          optionValue="material"
          placeHolderText="Select Material"
          className=""
          getFormErrorMessage={getFormErrorMessage}
        />
        <DropDownInput
          control={control}
          showLabel={false}
          labelName="Unit"
          nameInput="unit"
          isEdit={true}
          isRequired={true}
          // value={selectedCity} onChange={(e) => setSelectedCity(e.value)}
          options={units}
          optionLabel="unit"
          optionValue="code"
          placeHolderText="Select Unit"
          className=""
          getFormErrorMessage={getFormErrorMessage}
        />
      </div>
      <div className="registerInput__container-x2">
        <NumberInput
          width="100%"
          showLabel={false}
          isRequired={true}
          control={control}
          label="Unit Price"
          nameInput="unitPrice"
          placeHolderText="Add Price per unit"
          getFormErrorMessage={getFormErrorMessage}
        //   rules={{
        //     maxLength: {
        //       value: 7,
        //       message: "El campo supera los 7 caracteres",
        //     },
        //     required: errors => { console.log(errors); return errors.add ? '*El campo es requerido.' : false},
        //     pattern: {
        //       value: /^\S/,
        //       message: "No debe tener espacios al inicio",
        //     },
        //   }}
        />
        <Button
          className="dark-blue fullwidth"
          label="Add"
		  name="add"
          type="button"
          onClick={handleMaterials}
        />
      </div>
      <div className="materialsCard__grid">
        {recyclableMaterials.map((material, key) => {
          return (
            <RecycleMaterialCard
			  key={key}
              material={material.type}
              unit={material.unit}
              price={material.price}
              color={material.color}
            />
          );
        })}
      </div>
      <UploadPhotoInput type="imageUpload" />
      <TextAreaInput
        label="Bio"
        nameInput="bio"
        showLabel={true}
        control={control}
        isRequired={false}
        placeHolderText="Tell us about your company"
        getFormErrorMessage={getFormErrorMessage}
        rules={{
          maxLength: {
            value: 50,
            message: "El campo supera los 50 caracteres",
          },
          required: "*El campo es requerido.",
          pattern: {
            value: /^\S/,
            message: "No debe tener espacios al inicio",
          },
        }}
      />
    </>
  );
};

export default FormTwo;
