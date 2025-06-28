import { useRef, useState } from "react"

const FileUpload = ({handleFileInputChange}) => {
    const fileInput = useRef(null);

    const handleUploadPicture = () => {
        fileInput.current.click();
    }

    return (
        <div>
            <input type="file" name="profile_picture" className="file-input" ref={fileInput} onChange={handleFileInputChange} />
            <button className="buttons" id="upload-file-button" onClick={handleUploadPicture}>Upload Profile Picture</button>
        </div>
    )
}

export default FileUpload;