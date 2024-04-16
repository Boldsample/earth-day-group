import React from "react";
import {
  TextInput,
  NumberInput,
  PasswordInput,
  TextAreaInput,
  DropDownInput,
  CheckBoxInput,
  FileUploadInput,
  UploadPhotoInput,
} from "@ui/forms";
import countries from "@json/countries.json";
import materials from "@json/recyclableMaterials.json";
import { Button } from "primereact/button";
import RecycleMaterialCard from "../../../ui/cards/recycleMaterialCard/RecycleMaterialCard";

const FormTwo = ({
  control,
  getFormErrorMessage,
  photoFileBlob,
  setPhotoFileBlob,
  getValues,
  recyclableMaterials,
  setRecyclableMaterials,
  reset,
  setValue
}) => {
  const units = [
    { unit: "Kilo", code: "Kg" },
    { unit: "Pound", code: "Lb" },
  ];
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
          rules={{
            maxLength: {
              value: 7,
              message: "El campo supera los 7 caracteres",
            },
            required: "*El campo es requerido.",
            pattern: {
              value: /^\S/,
              message: "No debe tener espacios al inicio",
            },
          }}
        />
        <Button className="dark-blue fullwidth" label="Add" type="submit" onClick={()=>{
          const _material = getValues(['materials', 'unit', 'unitPrice'])
          const selectedMaterial = {
            type: _material[0],
            unit: _material[1],
            price: _material[2],
            color: _material[0].toLowerCase() + 'Category'
          }
          setRecyclableMaterials([...recyclableMaterials, selectedMaterial])
          // reset({materials: '', unit: '', unitPrice: null})
          setValue('materials', '');
          setValue('unit', '');
          setValue('unitPrice', '');

        }} />
      </div>
      <div className="materialsCard__grid">
        {recyclableMaterials.map(material =>{
          return <RecycleMaterialCard
          material={material.type}
          unit={material.unit}
          price={material.price}
          color={material.color}
          />
        })}
        {/* <RecycleMaterialCard
          material="Paper"
          unit="1kg"
          price="$2.5"
          color="paperCategory"
        /> */}
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
