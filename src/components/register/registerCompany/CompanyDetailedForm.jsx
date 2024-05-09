import { useRef } from "react"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { Button } from "primereact/button"

import materials from "@json/recyclableMaterials.json"
import { getUserData } from "@store/slices/usersSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import RecycleMaterialCard from "@ui/cards/recycleMaterialCard/RecycleMaterialCard"
import { NumberInput, DropDownInput, UploadPhotoInput, SwitchInput } from "@ui/forms"
import { createUser, addImages, addMaterials, updateUser } from "@services/userServices"

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
	  const _value = user.pick_up_from_home == 1 ? 0 : 1
    setUser({ ...user, pick_up_from_home: _value })
  }
  const setUploadedImages = (images) => {
    setUser({ ...user, images: images })
  }
  const createMaterial = () => {
    let _recyclableMaterials = [...user.materials]
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
    setUser({ ...user, materials: _recyclableMaterials })
    reset()
  }
  const removeMaterial = (clickedMaterial) => {
    const filteredMaterials = user.materials.filter(material => material.type !== clickedMaterial)
    setUser({ ...user, materials: filteredMaterials })
  };
  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const handleRecyclableMaterial = async (data) => {
    createMaterial()
    numberInput.current.getInput().blur()
  }
  const onSubmit = async () => {
    let id
    let _user = { ...user }
    delete _user.materials
    delete _user.images
    if(user.id){
      if(_user.password == ''){
        delete _user.password
        delete _user.password_confirmation
      }
      id = await updateUser({ ..._user }, {id: user.id})
    }else
      id = await createUser({ ..._user })

	  const _sendMaterials = user.materials.map(material => {
      let _material = {...material}
      _material.user = id
      return _material
    })
	  const _sendImages = user.images.map(image => {
      let _image = {...image}
      _image.user = id
      return _image
    })
    await addMaterials(_sendMaterials)
    await addImages(_sendImages)

    if(!user.id)
      dispatch(updateThankyou({
        title: "Congrats!",
        link: "/dashboard/",
        background: "image-1.svg",
        button_label: "Go to dashboard",
        content: "You’re all signed up! We send you a verification link send your provide email. Please verify your identity.",
      }))
    else
      toast.success("Your profile has been updated successfully.")
	  dispatch(getUserData(id))
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
        {user?.materials.map((material) => {
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
          checked={user.pick_up_from_home == 1}
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