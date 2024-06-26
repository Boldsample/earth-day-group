import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Button } from "primereact/button"
import { useNavigate } from "react-router"

import materials from "@json/recyclableMaterials.json"
import { getUserData } from "@store/slices/usersSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import RecycleMaterialCard from "@ui/cards/recycleMaterialCard/RecycleMaterialCard"
import { NumberInput, DropDownInput, UploadPhotoInput, SwitchInput } from "@ui/forms"
import { createUser, addImages, addMaterials, updateUser } from "@services/userServices"

const CompanyDetailedForm = ({ user, setUser }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
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
    let response
    let _user = { ...user }
    delete _user.materials
    delete _user.images
    setSending(true)
    if(user.id){
      if(_user.password == ''){
        delete _user.password
        delete _user.password_confirmation
      }
      response = await updateUser({ ..._user }, {id: user.id})
    }else{
      delete _user.password_confirmation
      response = await createUser({ ..._user })
    }
    if(response.field){
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
      setSending(false)
      return
    }
    const _sendMaterials = user.materials.map(material => {
      let _material = {...material}
      _material.user = response.id
      return _material
    })
    await addMaterials(_sendMaterials)
    const _sendImages = user.images.map(image => {
      let _image = {...image}
      _image.user = response.id
      return _image
    })
    await addImages(_sendImages)
    setSending(false)
    if(user?.id && response?.id){
      dispatch(updateThankyou({
        title: "Updated successfully!",
        link: "/settings/",
        background: "image-1.svg",
        button_label: "Go back to settings",
        content: "Your profile has updated successfully!",
      }))
      navigate('/thankyou/')
    }else if(response.id){
      dispatch(updateThankyou({
        title: "Congrats!",
        link: "/dashboard/",
        background: "image-1.svg",
        button_label: "Go to dashboard",
        content: "You’re all signed up! We send you a verification link send your provide email. Please verify your identity.",
      }))
      navigate('/thankyou/')
    }
    dispatch(getUserData(response.id))
	}

  return <>
    <form onSubmit={handleSubmit(handleRecyclableMaterial)}>
      <h5 className="recycableMaterialForm__title">This form is optional and can be completed later. If you prefer to skip it, click "Sign Up."</h5>
      <h4>Recyclable Material</h4>
      <div className="registerInput__container-x2">
        <DropDownInput
          isEdit={true}
          control={control}
          showLabel={false}
          isRequired={true}
          options={materials}
          labelName="Material"
          nameInput="materials"
          optionLabel="material"
          optionValue="material"
          placeHolderText="Select Material"
          getFormErrorMessage={getFormErrorMessage}
          rules={{
            required: "*El campo es requerido.",
          }} />
        <DropDownInput
          className=""
          isEdit={true}
          options={units}
          labelName="Unit"
          nameInput="unit"
          control={control}
          showLabel={false}
          isRequired={true}
          optionLabel="unit"
          optionValue="code"
          placeHolderText="Select Unit"
          getFormErrorMessage={getFormErrorMessage}
          rules={{
            required: "*El campo es requerido.",
          }} />
      </div>
      <div className="registerInput__container-x2">
        <NumberInput
          width="100%"
          disabled={false}
          control={control}
          showLabel={false}
          isRequired={true}
          label="Unit Price"
          inputRef={numberInput}
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
          }} />
        <Button
          name="add"
          label="Add"
          type="submit"
          style={{ paddingLeft: "1.375rem" }}
          className="green-earth fullwidth text-left" />
      </div>
    </form>
    <div className="materialsCard__grid">
      {user?.materials.map((material) => 
        <RecycleMaterialCard
          key={material.type}
          unit={material.unit}
          price={material.price}
          color={material.color}
          material={material.type}
          removeMaterial={removeMaterial} />
      )}
    </div>
    <UploadPhotoInput
      type="imageUpload"
      title="Add Images"
      uploadedImages={user.images}
      setUploadedImages={setUploadedImages} />
    <div className="registerInput__container-x2">
      <SwitchInput
        control={control}
        isRequired={false}
        nameInput="home_pick_up"
        label="Pick up from home?" />
    </div>
    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
      <Button onClick={onSubmit} className="dark-blue fullwidth" label="Sign up" name="submit" loading={sending} />
    </div>
  </>
}

export default CompanyDetailedForm