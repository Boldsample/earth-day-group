import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileUpload } from 'primereact/fileupload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import "./styles.sass"

const ConfigureAds = () => {
    const user = useSelector((state) => state.users.userData)
  return (
    <div className='layout'>
        <img className="layout__background" src="/assets/full-width.svg" />
        <div className={'main__content fullwidth ' + (user.role == 'user' ? 'useroffers' : '')}>
          <div className="ads__container">
            <div className='fullwidth'>
              <div className="flex flex-start mb-1">
                <h4 className='title__noWidth'>Main Header Banner</h4>
                <FontAwesomeIcon className='ml-1' color='var(--dark-blue)' icon={faCircleInfo} fontSize="25px" />
              </div>
                <p>This banner will appear at the top of the user's screen in a horizontal layout.</p>
                <div>
                <FileUpload name="demo[]" url={'/api/upload'} multiple accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop the image here to upload.</p>} />
                </div>
            </div>
            <div className='fullwidth mt-3'>
              <div className="flex flex-start mb-1">
                <h4 className='title__noWidth'>Home Menu Banner</h4>
                <FontAwesomeIcon className='ml-1' color='var(--dark-blue)' icon={faCircleInfo} fontSize="25px" />
              </div>
                <p>This banner appears as a rectangular menu button on every user's home screen.</p>
                <div>
                <FileUpload name="demo[]" url={'/api/upload'} multiple accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop the image here to upload.</p>} />
                </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default ConfigureAds
