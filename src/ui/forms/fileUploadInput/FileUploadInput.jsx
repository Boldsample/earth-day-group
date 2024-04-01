import { useState } from "react"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const FileUploadInput = ({ setPhotoFileBlob }) => {
	const [selectedFile, setSelectedFile] = useState(null)
	const handleFileChange = (event) => {
		const file = event.target.files[0]
		if(file){
			if(file.size <= 2 * 1024 * 1024){
				setSelectedFile(file)
				const reader = new FileReader()
				reader.onload = () => setPhotoFileBlob(reader.result)
				reader.readAsDataURL(file)
				event.target.value = ""
			}else
				alert("File size exceeds 2MB limit.")
			event.target.value = ""
		}
	}
	const handleCancelButton = (e) => {
		setSelectedFile(null)
		setPhotoFileBlob(null)
	}

	return <div>
		<label htmlFor="file" className="fileupload__label" style={selectedFile && { display: "none" }}>Click to upload</label>
		<input id="file" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
		{selectedFile && <div>
			<button className="fileUpload__btn" onClick={handleCancelButton}>
				<FontAwesomeIcon style={{ paddingRight: "5px" }} icon={faTrash} />
				{selectedFile.name}
			</button>
		</div>}
	</div>
}

export default FileUploadInput