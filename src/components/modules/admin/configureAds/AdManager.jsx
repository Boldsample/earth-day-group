import React, {useState, useEffect, useRef} from 'react'
import "./styles.sass"
import { TextInput, MultiSelectInput, CalendarInput } from "@ui/forms"
import { Calendar } from 'primereact/calendar';
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faCircleCheck, faRectangleAd, faBullseye, faClock, faLink } from '@fortawesome/free-solid-svg-icons'
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
        

const AdManager = () => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const user = useSelector((state) => state.users.userData)
    const [date, setDate] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const toast = useRef(null);
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
        ad_name: "",
        ad_url: "",
        ad_target: "",
        ad_duration: "",
        ad_image: null,
      },
    })
    const adImage = watch('ad_image'); 
    const modules = [
        { name: 'Users' },
        { name: 'Companies' },
        { name: 'Foundations/NGOs'},
    ];

    const showSuccess = () => {
      toast.current.show({severity:'success', summary: 'Success', detail:'Ad was created succesfully', life: 20000});
  }

    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
  
        reader.readAsDataURL(blob);
  
        reader.onloadend = function () {
            const base64data = reader.result;
            setValue("ad_image", base64data)
        };
    };

    const convertBannerBlob = () => {
      const base64Data = getValues("ad_image");
      if (base64Data) {
        // Convert base64 string back to a Blob
        const byteString = atob(base64Data.split(',')[1]);
        const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
    
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
    
        const blob = new Blob([ab], { type: mimeString });
        const imageUrl = URL.createObjectURL(blob);
    
        setBannerPreview(imageUrl);
      }
    };


  useEffect(() => {
    if(adImage !=null ){
      setTimeout(() => {
        setLoading(false)
      }, "2000");
      convertBannerBlob();
    }
  }, [adImage, loading]);

  const onSubmit = async (data) => {
    showSuccess()
    setSubmitted(true)
  console.log(data)
  }

  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>

  return (
    <>
    <Dialog header="Header" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
        <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
    </Dialog>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Toast ref={toast} />
    <div className='fullwidth mt-3'>
            <div className="flex flex-start mb-1">
              <h4 className='title__noWidth'>Home Menu Banner</h4>
              <button className='info__btn' onClick={() => setVisible(true)}><FontAwesomeIcon color='var(--dark-blue)' icon={faCircleInfo} fontSize="25px" /></button>
            </div>
              <p>This banner appears as a rectangular menu button on every user's home screen.</p>
            {adImage == null ? 
              <div>
              <FileUpload name="banner_image" customUpload uploadHandler={customBase64Uploader} url={'/api/upload'} accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop the image here to upload.</p>} />
              </div>
          :
          <div className='p-fileupload p-fileupload-advanced p-component mt-3'>
          <div className='p-fileupload p-fileupload-buttonbar space-between'>
              <div>
                {submitted === true ? "" :  <button type='submit' onClick={handleSubmit(onSubmit)} form='ad_form ' className='green-earth'>Create Ad</button>}
                <button className='red-state'>{submitted === true ? 'Cancel Campaign' : 'Cancel'}</button>
              </div>
            {submitted && 
              <div class="live-container">
                <div class="live-circle"></div>
                <div class="live-text">LIVE</div>
              </div>
            }
          </div>
          <div className='p-fileupload-content'>
            {submitted === true ? 
            <div className="form__container">
              <div className='width-50'>
              <div className="flex">
                <FontAwesomeIcon  color='var(--dark-blue)' icon={faRectangleAd} fontSize="15px" />
                <h5><span>Ad Name:</span> Pepsi Campaign</h5>
              </div>
              <div className="flex">
                <FontAwesomeIcon  color='var(--dark-blue' icon={faBullseye} fontSize="15px" />
                <h5><span>Ad Target:</span> Users, NGOs, Companies </h5>
              </div>
              <div className="flex">
                <FontAwesomeIcon  color='var(--dark-blue)' icon={faClock} fontSize="15px" />
                <h5> <span>Ad Duration: </span>09/10/2024 to 09/15/2024 </h5>
              </div>
              <div className="flex">
                <FontAwesomeIcon  color='var(--dark-blue)' icon={faLink} fontSize="15px" />
                <h5><span>Ad Link:</span> www.hotmail.com </h5>  
              </div>
              </div>
              <div className=' title-uploader-container width-50 ad-summary-image'>
                <img src={bannerPreview} alt="Banner preview" height="200px" />
            </div>
            </div>
            :
            <div className='form__container'>
            <div className="form__width75">
            <div className="registerInput__container-x2 mt-0">
              <TextInput
                width="100%"
                // disabled={ID}
                control={control}
                isRequired={true}
                labelName="Ad Name"
                nameInput="ad_name"
                placeHolderText="Pepsi Summer Campaign*"
                getFormErrorMessage={getFormErrorMessage}
                rules={{
                  maxLength: {
                    value: 50,
                    message: "The field exceeds 50 characters.",
                  },
                  required: "*The field is required.",
                  pattern: {
                    value: /^[a-zA-Z_]+$/,
                    message: "It must have only letters and underscore.",
                  },
                }} />
                <TextInput
                control={control}
                isRequired={true}
                labelName="Ad URL"
                nameInput="ad_url"
                placeHolderText="www.pepsi.com/landing"
                getFormErrorMessage={getFormErrorMessage}
                rules={{
                  maxLength: {
                    value: 100,
                    message: "The field exceeds 50 characters.",
                  },
                  pattern: {
                    value: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?(\/[a-zA-Z0-9-_?=&]+)?$/,
                    message: "Please enter a valid URL",
                  },
                }} />
            </div>
            <div className="registerInput__container-x2 mt-0">
              <MultiSelectInput
                className=""
                isEdit={true}
                options={modules}
                labelName="Who can view this Ad?"
                nameInput="ad_target"
                control={control}
                showLabel={true}
                isRequired={true}
                optionLabel="name"
                optionValue="name"
                placeHolderText="Select Modules"
                getFormErrorMessage={getFormErrorMessage}
                rules={{
                  required: "*El campo es requerido.",
                }} />
                  <CalendarInput
                  nameInput="ad_duration"
                  control={control}
                  isRequired={true}
                  labelName="Select Ad Duration"
                  rules={{
                    required: true,
                  }} />
              </div>
              {/* <button type='submit' className='green-earth'>Create Ad</button> */}
        </div>
        <div className="preview-container">
        <div className='image__preview-container' style={loading === true ? {justifyContent: 'center'} : {justifyContent: 'end'}}> 
          {loading === true ? 
            <ProgressSpinner 
              style={{width: '50px', height: '50px'}} 
              strokeWidth="8" 
              fill="var(--surface-ground)" 
              animationDuration=".5s" 
            /> 
              : 
              <>
            <div className=' title-uploader-container'>
              <h6 className='text-center'>Uploaded Image</h6>
              <FontAwesomeIcon className={`confirmation-check ${loading === false ? 'showCheck' : ''}`} color='var(--green-earth)' icon={faCircleCheck} fontSize="15px" />
            </div>
            <img src={bannerPreview} alt="Banner preview" height="70%" />
              </>
            }
          </div>
        </div>

            </div>
            }
          
          </div>
          </div>
        }
        </div>
      </form>
    </>
  )
}

export default AdManager