import React, { useState } from "react";
import "./fileUploadInput.sass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const FileUploadInput = ({ setPhotoFileBlob }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [buttonText, setButtonText] = useState("Upload File");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        setSelectedFile(file);
        setButtonText("Cancel Upload");
        const reader = new FileReader();
        reader.onload = () => {
          setPhotoFileBlob(reader.result);
        };
        reader.readAsDataURL(file);
        event.target.value = "";
      } else {
        alert("File size exceeds 2MB limit.");
        event.target.value = null;
      }
    }
  };

  const handleCancelButton = (e) => {
    setSelectedFile(null);
    setButtonText("Upload File");
    setPhotoFileBlob(null);
  };

  return (
    <div>
      <label
        style={selectedFile && { display: "none" }}
        htmlFor="file"
        className="fileupload__label"
      >
        Click to upload
      </label>
      <input
        style={{ display: "none" }}
        id="file"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {selectedFile && (
        <div>
          <button className="fileUpload__btn" onClick={handleCancelButton}>
            <FontAwesomeIcon style={{ paddingRight: "5px" }} icon={faTrash} />
            {selectedFile.name}
          </button>
          {/* <p>Selected File: {selectedFile.name}</p>  */}
        </div>
      )}
      {/* {!selectedFile && <button>{buttonText}</button>} */}
    </div>
  );
};

export default FileUploadInput;
