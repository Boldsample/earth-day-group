import React, {useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileUpload } from 'primereact/fileupload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { useForm } from "react-hook-form"

import "./styles.sass"

const ConfigureAds = () => {
    const user = useSelector((state) => state.users.userData)
    const {
      watch,
      reset,
      control,
      setValue,
      setFocus,
      setError,
      getValues,
      handleSubmit,
      formState: { errors },
    } = useForm({
      defaultValues: {
        banner_image: "",
        banner_link: "",
        ad_duration: "",
      },
    })

    const customBase64Uploader = async (event) => {
      // convert file to base64 encoded
      const file = event.files[0];
      const reader = new FileReader();
      let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

      reader.readAsDataURL(blob);

      reader.onloadend = function () {
          const base64data = reader.result;
          console.log(base64data)
      };
  };


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
                <FileUpload name="demo[]" url={'/api/upload'} multiple accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0"
                  watch={watch}
                  control={control}
                  setError={setError}
                  setValue={setValue}
                  getValues={getValues}
                >Drag and drop the image here to upload.</p>} />
                </div>
            </div>
            <div className='fullwidth mt-3'>
              <div className="flex flex-start mb-1">
                <h4 className='title__noWidth'>Home Menu Banner</h4>
                <FontAwesomeIcon className='ml-1' color='var(--dark-blue)' icon={faCircleInfo} fontSize="25px" />
              </div>
                <p>This banner appears as a rectangular menu button on every user's home screen.</p>
                <div>
                <FileUpload name="banner_image" customUpload uploadHandler={customBase64Uploader} url={'/api/upload'} accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop the image here to upload.</p>} />
                </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default ConfigureAds
