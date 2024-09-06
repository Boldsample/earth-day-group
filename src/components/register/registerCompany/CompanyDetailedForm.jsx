import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Button } from "primereact/button"
import { InputSwitch } from "primereact/inputswitch"
import { useNavigate, useParams } from "react-router"
import { useTranslation } from 'react-i18next'

import materials from "@json/recyclableMaterials.json"
import { getUserData } from "@store/slices/usersSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import { NumberInput, DropDownInput, UploadPhotoInput } from "@ui/forms"
import RecycleMaterialCard from "@ui/cards/recycleMaterialCard/RecycleMaterialCard"
import { createUser, addImages, addMaterials, updateUser } from "@services/userServices"

const CompanyDetailedForm = ({ user, setUser, ID }) => {
  const [t] = useTranslation('translation', { keyPrefix: 'register.registerCompany.companyDetailedForm'})
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const [tGlobal2] = useTranslation('translation', {keyPrefix: 'global'})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const numberInput = useRef(null)
  const { username } = useParams()
  const [sending, setSending] = useState(false)
  const units = [
    { unit: t('dropDownKiloOption'), code: "Kg" },
    { unit: t('dropDownPoundOption'), code: "Lb" },
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
  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
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
  const handleRecyclableMaterial = async (data) => {
    createMaterial()
    numberInput.current.getInput().blur()
  }
  const onSubmit = async () => {
    let response
    let data = { ...user }
    delete data.images
    delete data.materials
    setSending(true)
    if(ID){
      if(data.password == '')
        delete data.password
      delete data.password_confirmation
      response = await updateUser({ ...data }, {id: ID}, ID)
    }else{
      delete data.password_confirmation
      response = await createUser({ ...data })
    }
    if(response?.id){
      const _sendMaterials = user.materials.map(material => {
        let _material = {...material}
        _material.user = response?.id
        return _material
      })
      await addMaterials(_sendMaterials)
      const _sendImages = user.images.map(image => {
        let _image = {...image}
        _image.entity = response?.id
        return _image
      })
      await addImages(_sendImages)
    }
    setSending(false)
    if(response?.id == user?.id)
      dispatch(getUserData(response?.id))
    if(ID && response?.id){
      dispatch(updateThankyou({
        title: tGlobal2('updateUserTitleThankYouPage'),
        link: username ? "/users/" : "/dashboard/",
        background: "image-1.svg",
        button_label: username ? tGlobal2('updateUserBtnLabelThankYouPage') : tGlobal2('updateUserBtnLabelThankYouPage2'),
        content: tGlobal2('updateUsercontentText'),
      }))
      navigate('/thankyou/')
    }else if(response?.id){
      dispatch(updateThankyou({
        title: tGlobal2('createUserTitleThankYouPage'),
        link: "/dashboard/",
        background: "image-1.svg",
        button_label: tGlobal2('createUserBtnLabelThankYouPage2'),
        content: tGlobal2('createUsercontentText'),
      }))
      navigate('/thankyou/')
    }else{
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
      return
    }
	}
  
  return <>
    <form onSubmit={handleSubmit(handleRecyclableMaterial)}>
      <h5 className="recycableMaterialForm__title">{t('formDisclaimerTitle')}</h5>
      <h4>{t('materialInputsTitle')}</h4>
      <div className="registerInput__container-x2">
        <DropDownInput
          isEdit={true}
          control={control}
          showLabel={false}
          isRequired={true}
          options={materials}
          labelName={t('selectMaterialLabel')}
          nameInput="materials"
          optionLabel="material"
          optionValue="material"
          placeHolderText={t('SelectMaterialPlaceHolder')}
          getFormErrorMessage={getFormErrorMessage}
          rules={{
            required: tGlobal(`requiredErrorMessage`),
          }} />
        <DropDownInput
          className=""
          isEdit={true}
          options={units}
          labelName={t('selectUnitlLabel')}
          nameInput="unit"
          control={control}
          showLabel={false}
          isRequired={true}
          optionLabel="unit"
          optionValue="code"
          placeHolderText={t('selectUnitPlaceHolder')}
          getFormErrorMessage={getFormErrorMessage}
          rules={{
            required: tGlobal(`requiredErrorMessage`),
          }} />
      </div>
      <div className="registerInput__container-x2">
        <NumberInput
          width="100%"
          disabled={false}
          control={control}
          showLabel={false}
          isRequired={true}
          label={t('addPricelLabel')}
          inputRef={numberInput}
          nameInput="unit_price"
          placeHolderText={t('addPricePlaceHolder')}
          getFormErrorMessage={getFormErrorMessage}
          rules={{
            maxLength: {
              value: 3,
              message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 3}),
            },
            required: tGlobal(`requiredErrorMessage`),
            pattern: {
              value: /^\S/,
              message: tGlobal('patternErrorMessage'),
            },
          }} />
        <Button
          name="add"
          label={t('addMaterialBtnText')}
          type="submit"
          style={{ paddingLeft: "1.375rem" }}
          className="green-earth fullwidth text-left" />
      </div>
    </form>
    <div className="materialsCard__grid">
      {user?.materials?.map((material) => 
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
      title={t('addCompanyImgsLabel')}
      uploadedImages={user.images}
      setUploadedImages={setUploadedImages} />
    <div className="registerInput__container-x2">
      <InputSwitch
        id="pick_up_from_home"
        checked={!!user?.pick_up_from_home}
        onChange={e => setUser(prev => { return {...prev, pick_up_from_home: !user?.pick_up_from_home} })} /> {t('pickUpFromHomeLabel')}
    </div>
    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
      <Button onClick={onSubmit} className="dark-blue fullwidth" label={user.id ? t('saveBtnText') : t('signUpBtnText')} name="submit" loading={sending} />
    </div>
  </>
}

export default CompanyDetailedForm