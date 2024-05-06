import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faClose } from "@fortawesome/free-solid-svg-icons";
import FileUploadInput from "../fileUploadInput";
import "./uploadprofilephotoinput.sass";
import ProfilePhoto from "../../profilePhoto/ProfilePhoto";

const UploadPhotoInput = ({
  type,
  watch,
  control,
  setValue,
  getValues,
  title,
  iconColor,
  className,
  setUploadedImages,
  uploadedImages,
}) => {
  const [reachedImageCapacity, setReachedImageCapacity] = useState(false);
  const [imageId, setImageId] = useState(0);
  // const [uploadedImages, setUploadedImages] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          if (uploadedImages.length >= 7) {
            setReachedImageCapacity(true);
          } else {
            setUploadedImages([
              ...uploadedImages,
              { id: imageId, data: reader.result },
            ]);
            setImageId((imageId) => imageId + 1);
          }
        };
        reader.readAsDataURL(file);
        event.target.value = "";
      } else {
        alert("File size exceeds 2MB limit.");
        event.target.value = "";
      }
    }
  };

  const removeImage = (clickedImage) => {
    if (uploadedImages.length <= 7) {
      setReachedImageCapacity(false);
    }
    const filteredImages = uploadedImages.filter(
      (image) => image.id !== clickedImage
    );
    setUploadedImages(filteredImages);
  };

  const renderContent = () => {
    switch (type) {
      case "profilePhotoUpload":
        return (
          <div className="profile__container">
            <div className="profilePicture__container">
              <ProfilePhoto userPhoto={getValues("picture")} />
            </div>
            <div className="profileUpload__container">
              <h5 className="profileUpload__title text-defaultCase">
                Profile Picture
              </h5>
              <FileUploadInput
                watch={watch}
                control={control}
                nameInput="picture"
                setValue={setValue}
              />
            </div>
          </div>
        );
      case "imageUpload":
        return (
          <div className={`imagesHub__container ${className}`}>
            <h4>{title}</h4>
            <div className="imageCarousel__container">
              <div className="imageUpload__container">
                <label htmlFor="file" className="imageUpload__button">
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    color="#408D27"
                    fontSize="20px"
                  />
                </label>
                <input
                  id="file"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              <div className="imageCatalog__container">
                {uploadedImages.map((image) => (
                    <div key={image.id} className="image__container">
                      <button
                        className="close__btn"
                        onClick={() => removeImage(image.id)}
                      >
                        <FontAwesomeIcon
                          icon={faClose}
                          color="green"
                          fontSize="10px"
                        />
                      </button>
                      <img className="uploadedImage" src={image.data} alt="" />
                    </div>
                ))}
              </div>
            </div>
            {reachedImageCapacity && (
              <small className="p-error">
                *You can only Upload 7 images. Please remove one if you wish to
                add a new one.
              </small>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="">{renderContent()}</div>;
};

export default UploadPhotoInput;
