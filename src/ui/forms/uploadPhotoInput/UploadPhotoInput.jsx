import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudArrowUp, faClose, faUser, faMapPin } from "@fortawesome/free-solid-svg-icons"
import { useTranslation } from 'react-i18next'
import InfoTooltip from "@ui/tooltip/InfoTooltip"
import FileUploadInput from "../fileUploadInput"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"

import "./uploadprofilephotoinput.sass"
import { faBookmark } from "@fortawesome/free-regular-svg-icons"

const UploadPhotoInput = ({
  type,
  title,
  watch,
  control,
  setValue,
  getValues,
  className,
  isRequired,
  toolTipMessage="",
  uploadedImages,
  setUploadedImages,
}) => {
  const [reachedImageCapacity, setReachedImageCapacity] = useState(false)
  const [t] = useTranslation('translation', {keyPrefix: 'global'})

  const handleFileChange = async e => {
    let _uploadedImages = [...uploadedImages]
    for(const file of Array.from(e?.target?.files)){
      if(file && file?.size <= 10 * 1024 * 1024){
        const reader = new FileReader()
        reader.onload = () => {
          if(_uploadedImages.length >= 7)
            setReachedImageCapacity(true)
          else{
            _uploadedImages.push({ picture: reader.result, is_main:  _uploadedImages.length ? 0 : 1})
            setUploadedImages([..._uploadedImages])
          }
        }
        reader.readAsDataURL(file)
      }else{
        alert("File size exceeds 10MB limit.")
        e.target.value = ""
      }
    }
    e.target.value = ""
  }
  const removeImage = (clickedImage) => {
    const filteredImages = uploadedImages.map((image, key) => key === clickedImage ? { ...image, deleted: 1 } : image)
    if(filteredImages.filter(image => !image.deleted).length <= 7)
      setReachedImageCapacity(false);
    setUploadedImages(filteredImages)
  }
  const markAsMain = (clickedImage) => {
    const _uploadedImages = uploadedImages.map((image, key) => ({...image, is_main: key == clickedImage ? 1 : 0}))
    setUploadedImages(_uploadedImages)
  }
  const renderContent = () => {
    switch (type) {
      case "profilePhotoUpload":
        return <div className="profile__container">
          <div className="profilePicture__container">
            <ProfilePhoto userPhoto={getValues("picture")} />
          </div>
          <div className="profileUpload__container">
            <h5 className="profileUpload__title text-defaultCase">{t('profileUploadLabel')}</h5>
            <FileUploadInput labelName={t('profileUploadBtn')} watch={watch} control={control} nameInput="picture" setValue={setValue}/>
          </div>
        </div>
      case "imageUpload":
        return <div className={`imagesHub__container p-field ${className || ''}`}>
          <label>{title}
          {toolTipMessage != "" && (
              <InfoTooltip toolTipMessage={toolTipMessage}/>
          )}
          </label>
          <div className="imageCarousel__container">
            <input id="file" type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
            <label htmlFor="file" className="imageUpload__button">
              <FontAwesomeIcon icon={faCloudArrowUp} color="#408D27" fontSize="1.25rem" />
            </label>
            {uploadedImages?.length && uploadedImages?.map((image, key) => {
              if(image.deleted)
                return
              return <div key={key} className="image__container">
                <button type="button" className="close__btn" onClick={() => removeImage(key)}><FontAwesomeIcon icon={faClose} color="green" fontSize="1rem" /></button>
                {image?.is_main == 1 ? 
                  <button type="button" className="is__main">{t('profileUploadMain')}</button>
                : 
				          <button type="button" className="as__main" onClick={() => markAsMain(key)}><FontAwesomeIcon icon={faBookmark} /><br />{t('profileUploadAsMain')}</button>
                }
                <img className="uploadedImage" src={image?.picture} alt="" />
              </div>
            }
            ) || null}
          </div>
          {reachedImageCapacity && 
            <small className="p-error">*You can only Upload 7 images. Please remove one if you wish to add a new one.</small>
          }
           {/* {isRequired && uploadedImages.length == 0 &&
            <small className="p-error">*Debes adjuntar al menos una foto.</small>
          } */}
        </div>
      default:
        return null
    }
  }
  
  return <div className="">{renderContent()}</div>
}

export default UploadPhotoInput