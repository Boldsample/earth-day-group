import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudArrowUp, faClose } from "@fortawesome/free-solid-svg-icons"

import FileUploadInput from "../fileUploadInput"
import ProfilePhoto from "@ui/profilePhoto/ProfilePhoto"

import "./uploadprofilephotoinput.sass"

const UploadPhotoInput = ({
  type,
  title,
  watch,
  control,
  setValue,
  getValues,
  className,
  uploadedImages,
  setUploadedImages,
}) => {
  const [reachedImageCapacity, setReachedImageCapacity] = useState(false)

  const handleFileChange = async e => {
    let _uploadedImages = [...uploadedImages]
    for(const file of Array.from(e?.target?.files)){
      if(file && file?.size <= 2 * 1024 * 1024){
        const reader = new FileReader()
        reader.onload = () => {
          if(_uploadedImages.length >= 7)
            setReachedImageCapacity(true)
          else{
            _uploadedImages.push({ picture: reader.result })
            setUploadedImages([..._uploadedImages])
          }
        }
        reader.readAsDataURL(file)
      }else{
        alert("File size exceeds 2MB limit.")
        e.target.value = ""
      }
    }
    e.target.value = ""
  }
  const removeImage = (clickedImage) => {
    if(uploadedImages.length <= 7)
      setReachedImageCapacity(false);
    const filteredImages = uploadedImages.filter((image, key) => key !== clickedImage)
    setUploadedImages(filteredImages)
  }
  const renderContent = () => {
    switch (type) {
      case "profilePhotoUpload":
        return <div className="profile__container">
          <div className="profilePicture__container">
            <ProfilePhoto userPhoto={getValues("picture")} />
          </div>
          <div className="profileUpload__container">
            <h5 className="profileUpload__title text-defaultCase">Profile Picture</h5>
            <FileUploadInput watch={watch} control={control} nameInput="picture" setValue={setValue} />
          </div>
        </div>
      case "imageUpload":
        return <div className={`imagesHub__container ${className}`}>
          <h4>{title}</h4>
          <div className="imageCarousel__container">
            <input id="file" type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
            <label htmlFor="file" className="imageUpload__button">
              <FontAwesomeIcon icon={faCloudArrowUp} color="#408D27" fontSize="1.25rem" />
            </label>
            {uploadedImages?.length && uploadedImages?.map((image, key) => 
              <div key={key} className="image__container">
                <button type="button" className="close__btn" onClick={() => removeImage(key)}><FontAwesomeIcon icon={faClose} color="green" fontSize="0.625rem" /></button>
                <img className="uploadedImage" src={image.picture} alt="" />
              </div>
            ) || null}
          </div>
          {reachedImageCapacity && 
            <small className="p-error">*You can only Upload 7 images. Please remove one if you wish to add a new one.</small>
          }
        </div>
      default:
        return null
    }
  }

  return <div className="">{renderContent()}</div>
}

export default UploadPhotoInput