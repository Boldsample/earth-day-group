import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useDispatch, useSelector } from "react-redux"

import materials from "@json/recyclableMaterials.json"
import { getUserData } from "@store/slices/usersSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import { createUser, addImages, addMaterials } from "@services/userServices"
import RecycleMaterialCard from "@ui/cards/recycleMaterialCard/RecycleMaterialCard"
import { NumberInput, DropDownInput, UploadPhotoInput, SwitchInput } from "@ui/forms"

const CompanyDetailedForm = ({ user, setUser }) => {
  const dispatch = useDispatch()
  const numberInput = useRef(null)
  const units = [
    { unit: "Kilo", code: "Kg" },
    { unit: "Pound", code: "Lb" },
  ]
  const {
    reset,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      unit: "",
      materials: "",
      unit_price: "",
    },
  })

  const setPickUpFromHome = () => {
    setUser({ ...user, pick_up_from_home: !user.pick_up_from_home })
  }
  const setUploadedImages = (images) => {
    setUser({ ...user, images: images })
  }
  const createMaterial = () => {
    let _recyclableMaterials = [...user.recyclableMaterials]
    const inputValue = getValues(["materials", "unit", "unit_price"])
    let selectedMaterial = {
      type: inputValue[0],
      unit: inputValue[1],
      price: inputValue[2],
      color: inputValue[0].toLowerCase() + "Category",
    }
    const duplicateIndex = _recyclableMaterials.findIndex(material => material.type == inputValue[0])
    if(duplicateIndex != -1){
      _recyclableMaterials = _recyclableMaterials.map((material, index) => {
        if(index === duplicateIndex)
          return { ...material, unit: inputValue[1], price: inputValue[2] }
        return material
      })
    }else
      _recyclableMaterials = [..._recyclableMaterials, {...selectedMaterial}]
    setUser({ ...user, recyclableMaterials: _recyclableMaterials })
    reset()
  }
  const removeMaterial = (clickedMaterial) => {
    const filteredMaterials = user.recyclableMaterials.filter(material => material.type !== clickedMaterial)
    setUser({ ...user, recyclableMaterials: filteredMaterials })
  };
  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const handleRecyclableMaterial = async (data) => {
    createMaterial()
    numberInput.current.getInput().blur()
  }
  const onSubmit = async () => {
    let _user = { ...user }
    delete _user.recyclableMaterials
    delete _user.images

    const id = await createUser({ ..._user })
	  const _sendMaterials = user.recyclableMaterials.map(material => { material.user = id; return material; })
	  const _sendImages = user.images.map(image => { delete image.id; image.user = id; return image; })
    
    await addMaterials(_sendMaterials)
    await addImages(_sendImages)
    dispatch(getUserData(id))
    dispatch(updateThankyou({
      title: "Congrats!",
      link: "/dashboard/",
      background: "image-1.svg",
      button_label: "Go to dashboard",
      content: "You’re all signed up! We send you a verification link send your provide email. Please verify your identity.",
    }))
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleRecyclableMaterial)}>
        <h5 className="recycableMaterialForm__title">
          This form is optional and can be completed later. If you prefer to
          skip it, click "Sign Up."
        </h5>
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
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              required: "*El campo es requerido.",
            }}
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
            rules={{
              required: "*El campo es requerido.",
            }}
          />
        </div>
        <div className="registerInput__container-x2">
          <NumberInput
            inputRef={numberInput}
            disabled={false}
            width="100%"
            showLabel={false}
            isRequired={true}
            control={control}
            label="Unit Price"
            nameInput="unit_price"
            placeHolderText="Add Price per unit"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 3,
                message: "El campo supera los 3 caracteres",
              },
              required: "*El campo es requerido.",
              pattern: {
                value: /^\S/,
                message: "No debe tener espacios al inicio",
              },
            }}
          />
          <Button
            className="green-earth fullwidth text-left"
            label="Add"
            name="add"
            type="submit"
            style={{ paddingLeft: "22px" }}
          />
        </div>
      </form>
      <div className="materialsCard__grid">
        {user?.recyclableMaterials.map((material) => {
          return (
            <RecycleMaterialCard
              key={material.type}
              material={material.type}
              unit={material.unit}
              price={material.price}
              color={material.color}
              removeMaterial={removeMaterial}
            />
          );
        })}
      </div>
      <UploadPhotoInput
        type="imageUpload"
        title="Add Images"
        uploadedImages={user.images}
        setUploadedImages={setUploadedImages}
      />
      <div className="registerInput__container-x2">
        <SwitchInput
          label={"Pick up from home?"}
          nameInput={"home_pick_up"}
          // control={control}
          checked={user.pick_up_from_home}
          setChecked={setPickUpFromHome}
          isRequired={false}
          isEdit={true}
          value={1}
        />
      </div>
      <div className="p-field" style={{ marginBottom: "24px" }}>
        <Button
          onClick={onSubmit}
          className="dark-blue fullwidth"
          label="Sign up"
          name="submit"
        />
      </div>
    </>
  )
}

export default CompanyDetailedForm