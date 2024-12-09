import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Button } from "primereact/button"
import { InputSwitch } from "primereact/inputswitch"
import { useNavigate, useParams } from "react-router"
import { useTranslation } from 'react-i18next'
import InfoTooltip from "@ui/tooltip/InfoTooltip"
import materials from "@json/recyclableMaterials.json"
import { getUserData } from "@store/slices/usersSlice"
import { updateThankyou } from "@store/slices/globalSlice"
import { NumberInput, DropDownInput, UploadPhotoInput } from "@ui/forms"
import RecycleMaterialCard from "@ui/cards/recycleMaterialCard/RecycleMaterialCard"
import { createUser, addImages, addMaterials, updateUser } from "@services/userServices"

const CompanyDetailedForm = ({ user, setUser, currentUserID }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const numberInput = useRef(null)
  const { username } = useParams()
  const [sending, setSending] = useState(false)
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})
  const [tMaterial] = useTranslation('translation', {keyPrefix: 'materials'})
  const [tGlobalErrors] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
  const [t, i18n] = useTranslation('translation', { keyPrefix: 'register.registerCompany.companyDetailedForm'})
  const [tToolTip] = useTranslation('translation', { keyPrefix: 'tooltips' })
  const {
    reset,
    watch,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      unit: "",
      materials: "",
      unit_price: "",
      currency: i18n.language == 'es' ? 'cop' : 'usd',
    },
  })

  const setUploadedImages = (images) => {
    setUser({ ...user, images: images })
  }
  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const createMaterial = () => {
    let _recyclableMaterials = [...user.materials]
    const inputValue = getValues(["materials", "unit", "unit_price", "currency"])
    let selectedMaterial = {
      type: inputValue[0],
      unit: inputValue[1],
      price: inputValue[2],
      currency: inputValue[3]
    }
    const duplicateIndex = _recyclableMaterials.findIndex(material => material.type == inputValue[0])
    if(duplicateIndex != -1){
      _recyclableMaterials = _recyclableMaterials.map((material, index) => {
        if(index === duplicateIndex)
          return { ...material, unit: inputValue[1], price: inputValue[2], currency: inputValue[3] }
        return material
      })
    }else
      _recyclableMaterials = [..._recyclableMaterials, {...selectedMaterial}]
    setUser({ ...user, materials: _recyclableMaterials })
    reset()
  }
  const removeMaterial = (clickedMaterial) => {
    const filteredMaterials = user.materials.map(material => material.type === clickedMaterial ? { ...material, deleted: 1 } : material)
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
    if(data?.id)
      response = await updateUser({ ...data }, {id: data?.id}, data?.id)
    else{
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
    if(response?.id == currentUserID)
      dispatch(getUserData(response?.id))
    if(data?.id && response?.id){
      dispatch(updateThankyou({
        title: tGlobal('updateUserTitleThankYouPage'),
        link: username ? '/dashboard/' : '/settings/profile/',
        background: "image-1.svg",
        button_label: username ? tGlobal('updateUserBtnLabelThankYouPage') : tGlobal('updateUserBtnLabelThankYouPage2'),
        content: tGlobal('updateUsercontentText'),
      }))
      navigate('/thankyou/')
    }else if(response?.id){
      dispatch(updateThankyou({
        title: tGlobal('createUserTitleThankYouPage'),
        link: "/login/",
        background: "image-1.svg",
        button_label: tGlobal('createUserBtnLabelThankYouPage'),
        content: tGlobal('newUserContentText'),
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
      <div className="inline-flex ">
        <h4>{t('materialInputsTitle')}</h4>
        <InfoTooltip toolTipMessage={tToolTip("recyclableMaterialsTooltipTitle")}  delay={300}/>
      </div>
      <div className="registerInput__container-x2">
        <DropDownInput
          isEdit={true}
          control={control}
          isRequired={true}
          optionLabel="label"
          optionValue="value"
          nameInput="materials"
          optionGroupLabel="label"
          optionGroupChildren="items"
          labelName={t('selectMaterialLabel')}
          getFormErrorMessage={getFormErrorMessage}
          placeHolderText={t('SelectMaterialPlaceHolder')}
          options={materials?.map(group => ({
            ...group,
            label: tMaterial(group?.label),
            items: group?.items.map(item => ({
              label: tMaterial(item?.label),
              value: item?.label
            }))
          }))}
          rules={{
            required: tGlobalErrors(`requiredErrorMessage`),
          }} />
        <DropDownInput
          className=""
          isEdit={true}
          nameInput="unit"
          control={control}
          isRequired={true}
          optionLabel="label"
          optionValue="value"
          labelName={t('selectUnitlLabel')}
          getFormErrorMessage={getFormErrorMessage}
          placeHolderText={t('selectUnitPlaceHolder')}
          options={materials?.flatMap(category => category?.items)?.find(item => item.label === watch('materials'))?.units?.map(unit => ({label: tMaterial(unit), value: unit})) || []}
          rules={{
            required: tGlobalErrors(`requiredErrorMessage`),
          }} />
      </div>
      <div className="registerInput__container-x2">
        <NumberInput
          mode="currency"
          disabled={false}
          control={control}
          isRequired={true}
          inputRef={numberInput}
          nameInput="unit_price"
          labelName={t('addPricelLabel')}
          getFormErrorMessage={getFormErrorMessage}
          placeHolderText={t('addPricePlaceHolder')}
          maxFractionDigits={watch('currency') == 'cop' ? 0 : 2}
          rules={{
            maxLength: {
              value: 3,
              message: tGlobalErrors(`inputMaxLengthErrorMessage`, {maxLength: 3}),
            },
            required: tGlobalErrors(`requiredErrorMessage`),
            pattern: {
              value: /^\S/,
              message: tGlobalErrors('patternErrorMessage'),
            },
          }} />
        <DropDownInput
          isEdit={true}
          control={control}
          isRequired={true}
          optionLabel="label"
          optionValue="value"
          nameInput="currency"
          labelName={tGlobal('currency')}
          placeHolderText={tGlobal('currency')}
          getFormErrorMessage={getFormErrorMessage}
          rules={{
            required: tGlobalErrors('requiredErrorMessage'),
          }}
          options={[
            {label: tGlobal('cop'), value: 'cop'},
            {label: tGlobal('usd'), value: 'usd'}
          ]} />
      </div>
      <div className="registerInput__container-x2">
        <Button
          name="add"
          type="submit"
          label={t('addMaterialBtnText')}
          style={{ paddingLeft: "1.375rem" }}
          className="green-earth text-left" />
      </div>
    </form>
    <div className="materialsCard__grid">
      {user?.materials?.map(material => {
        if(material.deleted)
          return
        return <RecycleMaterialCard
          key={material?.type}
          unit={material?.unit}
          price={material?.price}
          material={material.type}
          currency={material?.currency}
          removeMaterial={removeMaterial} />
      })}
    </div>
    <UploadPhotoInput
      type="imageUpload"
      title={t('addCompanyImgsLabel')}
      uploadedImages={user.images}
      setUploadedImages={setUploadedImages} />
    <div className="registerInput__container-x2">
        <div className="inline-flex mb-2">
          <p className="label-subtitle">{t('pickUpFromHomeLabel')}</p>
          <InfoTooltip toolTipMessage={tToolTip("selfPickUpToolTip")}  delay={300}/>
        </div> 
      <InputSwitch
        id="pick_up_from_home"
        checked={!!user?.pick_up_from_home}
        onChange={e => setUser(prev => { return {...prev, pick_up_from_home: !user?.pick_up_from_home} })} />
    </div>
    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
      <Button onClick={onSubmit} className="dark-blue fullwidth" label={user.id ? t('saveBtnText') : t('signUpBtnText')} name="submit" loading={sending} />
    </div>
  </>
}

export default CompanyDetailedForm