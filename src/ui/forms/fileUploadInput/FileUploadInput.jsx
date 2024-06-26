import { useState } from "react"
import { Controller } from "react-hook-form"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const FileUploadInput = ({
	watch,
	control,
	setValue,
	nameInput
}) => {
	const [selectedFile, setSelectedFile] = useState(null)
	const handleFileChange = (event) => {
		const file = event.target.files[0]
		if(file){
			if(file.size <= 2 * 1024 * 1024){
				setSelectedFile(file)
				const reader = new FileReader()
				reader.onload = () => {
					setValue(nameInput, reader.result)
				}
				reader.readAsDataURL(file)
			}else
				alert("File size exceeds 2MB limit.")
		}
	}
	const handleCancelButton = (e) => {
		setSelectedFile(null)
		setValue(nameInput, '')
	}

	return <div>
		<label htmlFor="fileUpload" className="fileupload__label" style={selectedFile && { display: "none" }}>Click to upload</label>
		<input id="fileUpload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
		<Controller
			name={nameInput}
			control={control}
			render={({ field }) => <input
				type="hidden"
				id={field.name}
				value={watch(field.name)} />
		} />
		{selectedFile && <div>
			<button className="fileUpload__btn" onClick={handleCancelButton}>
				<FontAwesomeIcon style={{ paddingRight: "0.3125rem" }} icon={faTrash} />
				{selectedFile.name}
			</button>
		</div>}
	</div>
}

export default FileUploadInput