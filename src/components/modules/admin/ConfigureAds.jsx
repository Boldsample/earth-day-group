import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileUpload } from 'primereact/fileupload';

const ConfigureAds = () => {
    const user = useSelector((state) => state.users.userData)
    console.log("hello")
  return (
    <div className='layout'>
        <img className="layout__background" src="/assets/full-width.svg" />
        <div className={'main__content fullwidth ' + (user.role == 'user' ? 'useroffers' : '')}>
            <div className='fullwidth'>
                <h1>hello world</h1>
                <div>
                <FileUpload name="demo[]" url={'/api/upload'} multiple accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default ConfigureAds