import React from 'react'
import { TextInput, NumberInput, PasswordInput, TextAreaInput, DropDownInput, CheckBoxInput, FileUploadInput, UploadProfilePhotoInput } from "@ui/forms"
import countries from "@json/countries.json"
import { Button } from 'primereact/button'
import RecycleMaterialCard from '../../../ui/cards/recycleMaterialCard/RecycleMaterialCard'

const FormTwo = ({control, getFormErrorMessage, photoFileBlob, setPhotoFileBlob  }) => {
  return (
    <>
    <h5>Please add a complete detailed  list of recyclable material</h5>
    <h4>Recyclable Material</h4>
    <div className="registerInput__container-x2">
    <DropDownInput
      control={control}
      showLabel={false}
      labelName="Location"
      nameInput="location"
      isEdit={true}
      isRequired={true}
      // value={selectedCity} onChange={(e) => setSelectedCity(e.value)}
      options={countries}
      optionLabel="name"
      optionValue="code"
      placeHolderText="Select Material"
      className=""
      getFormErrorMessage={getFormErrorMessage}
    />
     <DropDownInput
      control={control}
      showLabel={false}
      labelName="Location"
      nameInput="location"
      isEdit={true}
      isRequired={true}
      // value={selectedCity} onChange={(e) => setSelectedCity(e.value)}
      options={countries}
      optionLabel="name"
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
      label="Phone Number"
      nameInput="phone"
      placeHolderText="Add Price"
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
    <Button className="dark-blue fullwidth" label="Add" type="submit" />
    </div>
    <div className="materialsCard__grid">
        <RecycleMaterialCard material="Paper" unit="1kg" price="$2.5" color='paperCategory'/>
        <RecycleMaterialCard material="Glass" unit="1kg" price="$2.5" color='metalCategory'/>
        <RecycleMaterialCard material="Plastic" unit="1kg" price="$2.5" color='glassCategory'/>
        <RecycleMaterialCard material="Organic" unit="1kg" price="$2.5" color='organicCategory'/>  
    </div>
    <UploadProfilePhotoInput
        type='imageUpload'
    />
    <TextAreaInput
      label="Bio"
      nameInput="description"
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
  )
}

export default FormTwo