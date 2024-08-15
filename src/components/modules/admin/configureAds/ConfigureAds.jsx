import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FileUpload } from 'primereact/fileupload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { useForm } from "react-hook-form"
import { Dialog } from 'primereact/dialog';
import ContentBox from '@ui/cards/contentBox/ContentBox';
import AdManager from './AdManager';
import "../styles.sass"

const ConfigureAds = () => {
    const [visible, setVisible] = useState(false);
    const user = useSelector((state) => state.users.userData)
    const [bannerImg, setBannerImg] = useState(null)
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
          setBannerImg(base64data)
          console.log(base64data)
      };
  };


  return (
    <div className='layout'>
        <img className="layout__background" src="/assets/full-width.svg" />
        <div className={'main__content fullwidth ' + (user.role == 'user' ? 'useroffers' : '')}>
            <Dialog header="Header" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </Dialog>
          <div className="ads__container">
            <AdManager/>
            <AdManager/>
          </div>
        </div>
    </div>
  )
}

export default ConfigureAds
