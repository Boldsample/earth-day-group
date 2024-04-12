import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons"
import FileUploadInput from '../fileUploadInput';
import './uploadprofilephotoinput.sass'
import ProfilePhoto from '../../profilePhoto/ProfilePhoto'

const UploadProfilePhotoInput = ({ type, title,  photoFileBlob, setPhotoFileBlob }) => {
  const [uploadedImages, setUploadedImages] = useState([])
	const handleFileChange = (event) => {
    let _uploadedImage = []
    const file = event.target.files[0];
    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          // const uploadedImage = reader.result;
          // _uploadedImage.push(uploadedImage)
          setUploadedImages([...uploadedImages, reader.result]); 
        };
        reader.readAsDataURL(file);
        event.target.value = ""; 
      } else {
        alert("File size exceeds 2MB limit.");
        event.target.value = ""; 
      }
    }
  };
  console.log(uploadedImages)
  const renderCardContent = () => {
    switch (type) {
      case "profilePhotoUpload":
        return (
          <>
            <div className="profile__container">
              <div className="profilePicture__container">
                <ProfilePhoto userPhoto={photoFileBlob} />
              </div>
              <div className="profileUpload__container">
                <h5 className="profileUpload__title text-defaultCase">
                  Profile Picture
                </h5>
                <FileUploadInput setPhotoFileBlob={setPhotoFileBlob} />
              </div>
            </div>
          </>
        );
      case "imageUpload":
        return (
          <div className="imagesHub__container">
            <h4>Add Images</h4>
            <div className="imageCarousel__container">
              <div className="imageUpload__container">
                <label htmlFor='file' className='imageUpload__button'>
                  <FontAwesomeIcon icon={faCloudArrowUp} color='green' fontSize='20px'/>
                </label>
                <input id='file'  type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
              </div>
              <div className="images__container">
                  <img className='uploadedImage' src="https://lawnuk.com/wp-content/uploads/2014/02/shade%20grass.jpg" alt="" />
                  <img className='uploadedImage' src="https://lawnuk.com/wp-content/uploads/2014/02/shade%20grass.jpg" alt="" />
                  <img className='uploadedImage' src="https://lawnuk.com/wp-content/uploads/2014/02/shade%20grass.jpg" alt="" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="">{renderCardContent()}</div>;
};
  
  
//   return (
//     <div className="profile__container">
//       <div className="profilePicture__container">
//         <ProfilePhoto userPhoto={photoFileBlob} />
//       </div>
//       <div className="profileUpload__container">
//         <h5 className="profileUpload__title text-defaultCase">
//           Profile Picture
//         </h5>
//         <FileUploadInput setPhotoFileBlob={setPhotoFileBlob} />
//       </div>
//     </div>
//   );
// };

export default UploadProfilePhotoInput